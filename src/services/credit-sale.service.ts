import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditSaleEntity } from '../entities/credit-sale.entity';

@Injectable()
export class CreditSaleService {
  constructor(
    @InjectRepository(CreditSaleEntity)
    private readonly creditSaleRepository: Repository<CreditSaleEntity>
  ) {}

  async create(dto: Partial<CreditSaleEntity>): Promise<CreditSaleEntity> {
    const entity = this.creditSaleRepository.create(dto);
    return await this.creditSaleRepository.save(entity);
  }

  async findAll(): Promise<CreditSaleEntity[]> {
    return await this.creditSaleRepository.find();
  }
}
