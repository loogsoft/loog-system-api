import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreditSaleService } from '../services/credit-sale.service';
import { CreditSaleEntity } from '../entities/credit-sale.entity';

@Controller('credit-sale')
export class CreditSaleController {
  constructor(private readonly creditSaleService: CreditSaleService) {}

  @Post()
  async create(@Body() dto: Partial<CreditSaleEntity>): Promise<CreditSaleEntity> {
    return await this.creditSaleService.create(dto);
  }

  @Get()
  async findAll(): Promise<CreditSaleEntity[]> {
    return await this.creditSaleService.findAll();
  }
}
