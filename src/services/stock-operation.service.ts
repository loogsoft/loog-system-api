import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  StockMovementItemDto,
  StockMovementRequestDto,
} from 'src/dtos/request/stock-movement-request.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductVariationEntity } from 'src/entities/product-variation.entity';
import { StockMovementEntity } from 'src/entities/stock-movement.entity';
import {
  StockMovementType,
  StockOperationEntity,
} from 'src/entities/stock-operation.entity';
import { ProductStatusEnum } from 'src/dtos/enums/product-status.enum';
import { toLogString } from 'src/utils/logging';
import { CreditCustomerEntity } from 'src/entities/credit-customer.entity';
import { CreditSaleEntity } from 'src/entities/credit-sale.entity';
import { CreditSaleInstallmentEntity } from 'src/entities/credit-sale-installment.entity';
import { CreditSaleStatusEnum } from 'src/dtos/enums/credit-sale-status.enum';
import { CreditSaleInstallmentStatusEnum } from 'src/dtos/enums/credit-sale-instalment-status.enum';

type StockTarget = {
  product?: ProductEntity;
  variation?: ProductVariationEntity;
  stock: number;
  productName: string;
  unitPrice: number;
};

@Injectable()
export class StockOperationService {
  private readonly logger = new Logger(StockOperationService.name);

  constructor(
    @InjectRepository(StockOperationEntity)
    private readonly operationRepo: Repository<StockOperationEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async create(dto: StockMovementRequestDto, companyId: string) {
    this.logger.log(`create:start ${toLogString({ companyId, dto })}`);

    const items = this.normalizeItems(dto);

    if (!items.length) {
      throw new BadRequestException('Informe ao menos um produto na operação.');
    }

    const operationId = await this.dataSource.transaction(async (manager) => {
      const operation = await manager.save(
        StockOperationEntity,
        manager.create(StockOperationEntity, {
          companyId,
          type: dto.type,
          reason: dto.reason,
          paymentMethod: dto.paymentMethod,
          responsibleName: dto.responsibleName,
          responsibleEmail: dto.responsibleEmail,
          observation: dto.observation,
        }),
      );

      const movements: StockMovementEntity[] = [];
      const creditSaleProducts: ProductEntity[] = [];
      let operationTotal = 0;

      for (const item of items) {
        const target = await this.resolveTarget(manager, item, companyId);
        const nextStock = this.calculateNextStock(
          target.stock,
          item.quantity,
          dto.type,
          target.productName,
        );

        if (target.variation) {
          target.variation.stock = nextStock;
          await manager.save(ProductVariationEntity, target.variation);
        } else if (target.product) {
          target.product.stock = nextStock;
          if (dto.type === StockMovementType.OUT && nextStock <= 0) {
            target.product.status = ProductStatusEnum.DISABLED;
          }
          await manager.save(ProductEntity, target.product);
        }

        if (target.product) {
          creditSaleProducts.push(target.product);
        }

        const movementPrice =
          item.price ??
          String(Number((target.unitPrice * item.quantity).toFixed(2)));
        operationTotal += Number(movementPrice || 0);

        movements.push(
          manager.create(StockMovementEntity, {
            operation,
            operationId: operation.id,
            product: target.product,
            productId: target.product?.id,
            variation: target.variation,
            variationId: target.variation?.id,
            quantity: item.quantity,
            productName: item.productName ?? target.productName,
            price: movementPrice,
            companyId,
            type: dto.type,
            reason: dto.reason,
            paymentMethod: dto.paymentMethod,
            responsibleName: dto.responsibleName,
            responsibleEmail: dto.responsibleEmail,
            observation: dto.observation,
          }),
        );
      }

      await manager.save(StockMovementEntity, movements);

      if (dto.paymentMethod === 'Crediario') {
        await this.createCreditSale(
          manager,
          dto,
          companyId,
          operationTotal,
          creditSaleProducts,
        );
      }

      return operation.id;
    });

    const operation = await this.findOne(operationId, companyId);

    this.logger.log(`create:success ${toLogString({ id: operation.id })}`);

    return operation;
  }

  async findAll(companyId: string) {
    return this.operationRepo.find({
      where: { companyId },
      relations: {
        movements: {
          product: true,
          variation: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, companyId: string) {
    const operation = await this.operationRepo.findOne({
      where: { id, companyId },
      relations: {
        movements: {
          product: true,
          variation: true,
        },
      },
    });

    if (!operation) {
      throw new NotFoundException('Operação de estoque não encontrada');
    }

    return operation;
  }

  private normalizeItems(dto: StockMovementRequestDto): StockMovementItemDto[] {
    if (dto.items?.length) {
      return dto.items;
    }

    const hasLegacyItem =
      Boolean(dto.variationId?.trim() || dto.productId?.trim()) ||
      dto.quantity !== undefined ||
      Boolean(dto.productName?.trim()) ||
      Boolean(dto.price?.trim());

    if (!hasLegacyItem) {
      return [];
    }

    return [
      {
        variationId: dto.variationId,
        productId: dto.productId,
        quantity: Number(dto.quantity),
        productName: dto.productName,
        price: dto.price,
      },
    ];
  }

  private async resolveTarget(
    manager: EntityManager,
    item: StockMovementItemDto,
    companyId: string,
  ): Promise<StockTarget> {
    const variationId = item.variationId?.trim();
    const productId = item.productId?.trim();

    if (variationId && productId) {
      throw new BadRequestException(
        'Informe apenas variationId ou productId por item.',
      );
    }

    if (!variationId && !productId) {
      throw new BadRequestException(
        'Informe variationId ou productId em todos os itens.',
      );
    }

    if (variationId) {
      const variation = await manager.findOne(ProductVariationEntity, {
        where: { id: variationId, companyId },
        relations: { product: true },
      });

      if (variation) {
        return this.buildVariationTarget(variation);
      }

      const fallbackProduct = await this.findProduct(
        manager,
        variationId,
        companyId,
      );
      if (fallbackProduct) {
        return this.buildProductTarget(fallbackProduct);
      }

      throw new NotFoundException('Produto ou variação não encontrado');
    }

    const product = await this.findProduct(
      manager,
      productId as string,
      companyId,
    );

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.buildProductTarget(product);
  }

  private async findProduct(
    manager: EntityManager,
    productId: string,
    companyId: string,
  ) {
    return manager.findOne(ProductEntity, {
      where: { id: productId, companyId },
      relations: { variations: true },
    });
  }

  private buildVariationTarget(variation: ProductVariationEntity): StockTarget {
    return {
      product: variation.product,
      variation,
      stock: this.normalizeStock(variation.stock, variation.name),
      productName: variation.product?.name ?? variation.name,
      unitPrice: Number(variation.price ?? 0),
    };
  }

  private buildProductTarget(product: ProductEntity): StockTarget {
    const activeVariations = (product.variations ?? []).filter(
      (variation) => variation.isActive !== false,
    );

    if (activeVariations.length > 0) {
      throw new BadRequestException(
        'Este produto possui variações. Informe o variationId do item vendido.',
      );
    }

    return {
      product,
      stock: this.normalizeStock(product.stock, product.name),
      productName: product.name,
      unitPrice: Number(product.price ?? 0),
    };
  }

  private normalizeStock(
    value: number | string | null | undefined,
    label: string,
  ) {
    const stock = Number(value);

    if (!Number.isFinite(stock)) {
      throw new BadRequestException(`Estoque inválido para ${label}.`);
    }

    return stock;
  }

  private calculateNextStock(
    currentStock: number,
    quantity: number,
    type: StockMovementType,
    label: string,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero.');
    }

    if (type === StockMovementType.IN) {
      return currentStock + quantity;
    }

    if (quantity > currentStock) {
      throw new BadRequestException(
        `Quantidade maior que o estoque disponível para ${label}.`,
      );
    }

    return currentStock - quantity;
  }

  private addMonths(date: Date, months: number): Date {
    const target = new Date(date);
    const originalDay = target.getDate();

    target.setMonth(target.getMonth() + months);

    if (target.getDate() !== originalDay) {
      target.setDate(0);
    }

    return target;
  }

  private async createCreditSale(
    manager: EntityManager,
    dto: StockMovementRequestDto,
    companyId: string,
    totalAmount: number,
    products: ProductEntity[],
  ) {
    const customerId = dto.creditCustomerId?.trim();
    const installment = dto.installment ?? 1;

    if (!customerId) {
      throw new BadRequestException(
        'Selecione um cliente do crediário antes de confirmar.',
      );
    }

    const customer = await manager.findOne(CreditCustomerEntity, {
      where: { id: customerId, companyId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!customer) {
      throw new NotFoundException('Cliente do crediário não encontrado');
    }

    const uniqueProducts = Array.from(
      new Map(
        products.filter(Boolean).map((product) => [product.id, product]),
      ).values(),
    );

    const creditSale = await manager.save(
      CreditSaleEntity,
      manager.create(CreditSaleEntity, {
        companyId,
        totalAmount,
        installment,
        status: CreditSaleStatusEnum.PENDING,
        date: new Date(),
        customer,
      }),
    );

    const totalCents = Math.round(Number(totalAmount) * 100);
    const baseCents = Math.floor(totalCents / installment);
    const remainderCents = totalCents % installment;
    const saleDate = new Date();

    const installments = Array.from({ length: installment }, (_, index) => {
      const installmentNumber = index + 1;
      const amountCents =
        installmentNumber === installment
          ? baseCents + remainderCents
          : baseCents;

      return manager.create(CreditSaleInstallmentEntity, {
        companyId,
        creditSale,
        installmentNumber,
        amount: amountCents / 100,
        status: CreditSaleInstallmentStatusEnum.PENDING,
        dueDate: this.addMonths(saleDate, installmentNumber),
      });
    });

    await manager.save(CreditSaleInstallmentEntity, installments);

    await manager.save(CreditCustomerEntity, {
      ...customer,
      totalAmounts: Number(customer.totalAmounts ?? 0) + Number(totalAmount),
    });

    if (uniqueProducts.length > 0) {
      await manager.save(
        ProductEntity,
        uniqueProducts.map((product) => ({
          ...product,
          creditSale,
        })),
      );
    }
  }
}
