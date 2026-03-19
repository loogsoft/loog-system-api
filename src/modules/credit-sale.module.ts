import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditSaleEntity } from '../entities/credit-sale.entity';
import { CreditSaleService } from '../services/credit-sale.service';
import { CreditSaleController } from '../controller/credit-sale.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreditSaleEntity])],
  providers: [CreditSaleService],
  controllers: [CreditSaleController],
})
export class CreditSaleModule {}
