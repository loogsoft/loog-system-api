import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreditSaleRequestDto } from 'src/dtos/request/credit-sale-request.dto';
import { CreditSaleResponseDto } from 'src/dtos/response/credit-sale-response.dto';
import { CreditCustomerEntity } from '../entities/credit-customer.entity';
import { CreditSaleEntity } from '../entities/credit-sale.entity';
import { ProductEntity } from '../entities/product.entity';
import { CreditSaleInstallmentStatusEnum } from 'src/dtos/enums/credit-sale-instalment-status.enum';
import { CreditSaleInstallmentEntity } from '../entities/credit-sale-installment.entity';

@Injectable()
export class CreditSaleService {
  constructor(
    @InjectRepository(CreditSaleEntity)
    private readonly creditSaleRepository: Repository<CreditSaleEntity>,
  ) {}

  private addMonths(date: Date, months: number): Date {
    const target = new Date(date);
    const originalDay = target.getDate();

    target.setMonth(target.getMonth() + months);

    if (target.getDate() !== originalDay) {
      target.setDate(0);
    }

    return target;
  }

  async create(
    dto: CreditSaleRequestDto,
    companyId: string,
  ): Promise<CreditSaleResponseDto> {
    const productIds = [...new Set(dto.productIds)];

    return await this.creditSaleRepository.manager.transaction(
      async (manager) => {
        const creditSaleRepository = manager.getRepository(CreditSaleEntity);
        const creditCustomerRepository =
          manager.getRepository(CreditCustomerEntity);
        const productRepository = manager.getRepository(ProductEntity);
        const creditSaleInstallmentRepository = manager.getRepository(
          CreditSaleInstallmentEntity,
        );
        const customer = await creditCustomerRepository.findOne({
          where: { id: dto.customerId, companyId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!customer) {
          throw new NotFoundException('Cliente do crediario nao encontrado');
        }

        const products = await productRepository.find({
          where: { id: In(productIds), companyId },
          relations: { creditSale: true },
        });

        if (products.length !== productIds.length) {
          throw new NotFoundException(
            'Um ou mais produtos nao foram encontrados',
          );
        }

        const entity = creditSaleRepository.create({
          companyId,
          totalAmount: dto.totalAmount,
          installment: dto.installment,
          status: dto.status,
          date: dto.date,
          customer,
        });

        const savedCreditSale = await creditSaleRepository.save(entity);

        const totalCents = Math.round(Number(dto.totalAmount) * 100);
        const baseCents = Math.floor(totalCents / dto.installment);
        const remainderCents = totalCents % dto.installment;
        const saleDate = new Date(dto.date);

        const installments = Array.from(
          { length: dto.installment },
          (_, index) => {
            const installmentNumber = index + 1;
            const amountCents =
              installmentNumber === dto.installment
                ? baseCents + remainderCents
                : baseCents;

            return creditSaleInstallmentRepository.create({
              companyId,
              creditSale: savedCreditSale,
              installmentNumber,
              amount: amountCents / 100,
              status: CreditSaleInstallmentStatusEnum.PENDING,
              dueDate: this.addMonths(saleDate, installmentNumber),
            });
          },
        );

        await creditSaleInstallmentRepository.save(installments);
        await creditCustomerRepository.save({
          ...customer,
          totalAmounts:
            Number(customer.totalAmounts ?? 0) + Number(dto.totalAmount),
        });

        await productRepository.save(
          products.map((product) => ({
            ...product,
            creditSale: savedCreditSale,
          })),
        );

        const createdCreditSale = await creditSaleRepository.findOneOrFail({
          where: { id: savedCreditSale.id, companyId },
          relations: {
            customer: true,
            products: true,
            installments: true,
          },
        });

        return plainToInstance(CreditSaleResponseDto, createdCreditSale, {
          excludeExtraneousValues: true,
        });
      },
    );
  }

  async findAll(companyId: string): Promise<CreditSaleResponseDto[]> {
    const creditSales = await this.creditSaleRepository.find({
      where: { companyId },
      relations: {
        customer: true,
        products: true,
        installments: true,
      },
      order: {
        date: 'DESC',
      },
    });

    return plainToInstance(CreditSaleResponseDto, creditSales, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string, companyId: string): Promise<CreditSaleResponseDto> {
    const creditSale = await this.creditSaleRepository.findOne({
      where: { id, companyId },
      relations: {
        customer: true,
        products: true,
        installments: true,
      },
    });

    if (!creditSale) {
      throw new NotFoundException('Crediario nao encontrado');
    }

    return plainToInstance(CreditSaleResponseDto, creditSale, {
      excludeExtraneousValues: true,
    });
  }
}
