import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovementEntity } from 'src/entities/stock-movement.entity';
import { ProductVariationEntity } from 'src/entities/product-variation.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { StockMovementRequestDto } from 'src/dtos/request/stock-movement-request.dto';
import { toLogString } from 'src/utils/logging';
import { StockMovementType } from 'src/entities/stock-movement.entity';
import { ProductsService } from 'src/services/products.service';

@Injectable()
export class StockMovementService {
  private readonly logger = new Logger(StockMovementService.name);

  constructor(
    @InjectRepository(StockMovementEntity)
    private readonly repo: Repository<StockMovementEntity>,

    @InjectRepository(ProductVariationEntity)
    private readonly variationRepo: Repository<ProductVariationEntity>,

    private readonly productsService: ProductsService,
  ) {}

  async create(dto: StockMovementRequestDto) {
    this.logger.log(`create:start ${toLogString({ dto })}`);

    try {
      let product: ProductEntity | null = null;
      let variation: ProductVariationEntity | null = null;
      const id = dto.variationId;
      const productName = dto.productName;

      try {
        product = await this.productsService.findOne(id);
      } catch {
        variation = await this.variationRepo.findOne({
          where: { id },
          relations: ['product'],
        });
      }

      if (!product && !variation) {
        throw new NotFoundException('Produto ou Variação não encontrado');
      }

      const movement = this.repo.create({
        quantity: dto.quantity,
        type: dto.type,
        reason: dto.reason,
        price: dto.price,
        paymentMethod: dto.paymentMethod,
        responsibleName: dto.responsibleName,
        responsibleEmail: dto.responsibleEmail,
        observation: dto.observation,
        variation: variation ?? undefined,
        productName,
      });
      const saved = await this.repo.save(movement);

      if (variation) {
        if (typeof variation.stock === 'number') {
          if (dto.type === StockMovementType.IN) {
            variation.stock += dto.quantity;
          } else {
            variation.stock -= dto.quantity;
          }
          await this.variationRepo.save(variation);
        }
        // Não chama updateStock do produto principal para variação
      } else if (product) {
        await this.productsService.updateStock(id, dto.quantity, dto.type);
      }

      this.logger.log(`create:success ${toLogString({ id: saved.id })}`);

      return saved;
    } catch (err) {
      this.logger.error('create:error', err);
      if (err instanceof Error) {
        this.logger.error('create:error:message', err.message);
        this.logger.error('create:error:stack', err.stack);
      }
      this.logger.error('create:error:dto', JSON.stringify(dto));
      throw err;
    }
  }

  async findAll() {
    this.logger.log('findAll:start');

    try {
      const movements = await this.repo.find({
        relations: ['variation'],
        order: { createdAt: 'DESC' },
      });

      this.logger.log(
        `findAll:success ${toLogString({ count: movements.length })}`,
      );

      return movements;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findAll:error', errorStack);
      throw err;
    }
  }

  async findByVariation(variationId: string) {
    this.logger.log(`findByVariation:start ${toLogString({ variationId })}`);

    try {
      const movements = await this.repo.find({
        where: { variation: { id: variationId } },
        relations: ['variation'],
        order: { createdAt: 'DESC' },
      });

      this.logger.log(
        `findByVariation:success ${toLogString({ count: movements.length })}`,
      );

      return movements;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findByVariation:error', errorStack);
      throw err;
    }
  }
}
