import { Expose } from 'class-transformer';
import { CreditSaleInstallmentStatusEnum } from '../enums/credit-sale-instalment-status.enum';
import { CreditSaleResponseDto } from './credit-sale-response.dto';

export class CreditSaleInstallmentResponseDto {
  @Expose()
  id: string;

  @Expose()
  installmentNumber: number;

  @Expose()
  creditSale: CreditSaleResponseDto;

  @Expose()
  amount: number;

  @Expose()
  dueDate: Date;

  @Expose()
  paidAt?: Date;

  @Expose()
  status: CreditSaleInstallmentStatusEnum;
}
