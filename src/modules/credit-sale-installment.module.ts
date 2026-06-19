import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditSaleEntity } from '../entities/credit-sale.entity';
import { CreditSaleInstallmentEntity } from '../entities/credit-sale-installment.entity';
import { CreditSaleInstallmentController } from '../controller/credit-sale-installment.controller';
import { CreditSaleInstallmentService } from '../services/credit-sale-installment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditSaleInstallmentEntity, CreditSaleEntity]),
  ],
  providers: [CreditSaleInstallmentService],
  controllers: [CreditSaleInstallmentController],
  exports: [CreditSaleInstallmentService],
})
export class CreditSaleInstallmentModule {}
