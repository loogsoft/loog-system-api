import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreditSaleInstallmentRequestDto } from 'src/dtos/request/credit-sale-installment-request.dto';
import { CreditSaleInstallmentResponseDto } from 'src/dtos/response/credit-sale-installment-response.dto';
import { CreditSaleStatusEnum } from 'src/dtos/enums/credit-sale-status.enum';
import { CreditSaleInstallmentStatusEnum } from 'src/dtos/enums/credit-sale-instalment-status.enum';
import { CreditSaleEntity } from '../entities/credit-sale.entity';
import { CreditSaleInstallmentEntity } from '../entities/credit-sale-installment.entity';

@Injectable()
export class CreditSaleInstallmentService {
  constructor(
    @InjectRepository(CreditSaleInstallmentEntity)
    private readonly repo: Repository<CreditSaleInstallmentEntity>,

    @InjectRepository(CreditSaleEntity)
    private readonly creditSaleRepo: Repository<CreditSaleEntity>,
  ) {}

  private async refreshCreditSaleStatus(creditSale: CreditSaleEntity) {
    const installments = await this.repo.find({
      where: {
        creditSale: {
          id: creditSale.id,
        },
      },
    });

    if (!installments.length) return;

    const allPaid = installments.every(
      (installment) =>
        installment.status === CreditSaleInstallmentStatusEnum.PAID,
    );
    const hasOverdue = installments.some(
      (installment) =>
        installment.status === CreditSaleInstallmentStatusEnum.OVERDUE,
    );

    const nextStatus = allPaid
      ? CreditSaleStatusEnum.COMPLETED
      : hasOverdue
        ? CreditSaleStatusEnum.LATE
        : CreditSaleStatusEnum.PENDING;

    if (creditSale.status !== nextStatus) {
      await this.creditSaleRepo.save({
        ...creditSale,
        status: nextStatus,
      });
    }
  }

  async create(
    dto: CreditSaleInstallmentRequestDto,
  ): Promise<CreditSaleInstallmentResponseDto> {
    const creditSale = await this.creditSaleRepo.findOne({
      where: { id: dto.creditSaleId },
    });

    if (!creditSale) {
      throw new NotFoundException('Crediario nao encontrado');
    }

    const entity = this.repo.create({
      installmentNumber: dto.installmentNumber,
      amount: dto.amount,
      dueDate: dto.dueDate,
      paidAt: dto.paidAt,
      status: dto.status,
      creditSale,
    });

    const saved = await this.repo.save(entity);
    await this.refreshCreditSaleStatus(creditSale);

    return plainToInstance(CreditSaleInstallmentResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<CreditSaleInstallmentResponseDto[]> {
    const installments = await this.repo.find({
      relations: { creditSale: true },
      order: { dueDate: 'ASC' },
    });

    return plainToInstance(CreditSaleInstallmentResponseDto, installments, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<CreditSaleInstallmentResponseDto> {
    const installment = await this.repo.findOne({
      where: { id },
      relations: { creditSale: true },
    });

    if (!installment) {
      throw new NotFoundException('Parcela do crediario nao encontrada');
    }

    return plainToInstance(CreditSaleInstallmentResponseDto, installment, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    dto: CreditSaleInstallmentRequestDto,
  ): Promise<CreditSaleInstallmentResponseDto> {
    const installment = await this.repo.findOne({
      where: { id },
    });

    if (!installment) {
      throw new NotFoundException('Parcela do crediario nao encontrada');
    }

    const creditSale = await this.creditSaleRepo.findOne({
      where: { id: dto.creditSaleId },
    });

    if (!creditSale) {
      throw new NotFoundException('Crediario nao encontrado');
    }

    Object.assign(installment, {
      installmentNumber: dto.installmentNumber,
      amount: dto.amount,
      dueDate: dto.dueDate,
      paidAt: dto.paidAt,
      status: dto.status,
      creditSale,
    });

    const updated = await this.repo.save(installment);
    await this.refreshCreditSaleStatus(creditSale);

    return plainToInstance(CreditSaleInstallmentResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }
}
