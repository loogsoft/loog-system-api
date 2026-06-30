import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditCustomerEntity } from '../entities/credit-customer.entity';
import { CreditCustomerRequestDto } from 'src/dtos/request/credit-customer-request.dto';
import { CreditCustomerResponseDto } from 'src/dtos/response/credit-customer-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreditCustomerService {
  constructor(
    @InjectRepository(CreditCustomerEntity)
    private readonly repo: Repository<CreditCustomerEntity>,
  ) {}

  async create(
    dto: CreditCustomerRequestDto,
    companyId: string,
  ): Promise<CreditCustomerResponseDto> {
    const entity = this.repo.create({ ...dto, companyId });
    const saved = await this.repo.save(entity);
    return plainToInstance(CreditCustomerResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(
    id: string,
    companyId: string,
  ): Promise<CreditCustomerResponseDto> {
    const entity = await this.repo.findOne({ where: { id, companyId } });

    if (!entity) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return plainToInstance(CreditCustomerResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    dto: CreditCustomerRequestDto,
    companyId: string,
  ): Promise<CreditCustomerResponseDto> {
    const entity = await this.repo.findOne({ where: { id, companyId } });

    if (!entity) {
      throw new NotFoundException('Cliente não encontrado');
    }

    Object.assign(entity, dto);
    const updated = await this.repo.save(entity);

    return plainToInstance(CreditCustomerResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string): Promise<CreditCustomerResponseDto[]> {
    const list = await this.repo.find({
      where: { companyId },
      order: { date: 'DESC' },
    });
    return plainToInstance(CreditCustomerResponseDto, list, {
      excludeExtraneousValues: true,
    });
  }
}
