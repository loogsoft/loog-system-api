import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCustomerEntity } from '../entities/credit-customer.entity';
import { CreditSaleEntity } from '../entities/credit-sale.entity';
import { ProductEntity } from '../entities/product.entity';
import { CreditSaleService } from '../services/credit-sale.service';
import { CreditSaleController } from '../controller/credit-sale.controller';
import { CreditSaleInstallmentModule } from './credit-sale-installment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditSaleEntity,
      CreditCustomerEntity,
      ProductEntity,
    ]),
    CreditSaleInstallmentModule 
  ],
  providers: [CreditSaleService],
  controllers: [CreditSaleController],
})
export class CreditSaleModule {}
