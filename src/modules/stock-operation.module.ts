import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOperationController } from 'src/controller/stock-operation.controller';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductVariationEntity } from 'src/entities/product-variation.entity';
import { CreditCustomerEntity } from 'src/entities/credit-customer.entity';
import { CreditSaleEntity } from 'src/entities/credit-sale.entity';
import { CreditSaleInstallmentEntity } from 'src/entities/credit-sale-installment.entity';
import { StockMovementEntity } from 'src/entities/stock-movement.entity';
import { StockOperationEntity } from 'src/entities/stock-operation.entity';
import { StockOperationService } from 'src/services/stock-operation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockOperationEntity,
      StockMovementEntity,
      ProductEntity,
      ProductVariationEntity,
      CreditCustomerEntity,
      CreditSaleEntity,
      CreditSaleInstallmentEntity,
    ]),
  ],
  controllers: [StockOperationController],
  providers: [StockOperationService],
  exports: [StockOperationService],
})
export class StockOperationModule {}
