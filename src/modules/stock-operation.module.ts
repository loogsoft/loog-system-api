import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOperationController } from 'src/controller/stock-operation.controller';
import { CreditCustomerEntity } from 'src/entities/credit-customer.entity';
import { CreditSaleInstallmentEntity } from 'src/entities/credit-sale-installment.entity';
import { CreditSaleEntity } from 'src/entities/credit-sale.entity';
import { ProductVariationEntity } from 'src/entities/product-variation.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { StockMovementEntity } from 'src/entities/stock-movement.entity';
import { StockOperationEntity } from 'src/entities/stock-operation.entity';
import { StockOperationService } from 'src/services/stock-operation.service';
import { ProductsModule } from './products.module';

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
    ProductsModule,
  ],
  controllers: [StockOperationController],
  providers: [StockOperationService],
  exports: [StockOperationService],
})
export class StockOperationModule {}
