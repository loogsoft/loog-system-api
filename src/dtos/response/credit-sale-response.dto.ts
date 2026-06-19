import { Expose, Type } from 'class-transformer';
import { CreditSaleStatusEnum } from '../enums/credit-sale-status.enum';
import { ProductResponseDto } from './product-response.dto';
import { CreditCustomerResponseDto } from './credit-customer-response.dto';
import { CreditSaleInstallmentResponseDto } from './credit-sale-installment-response.dto';

export class CreditSaleResponseDto {
  @Expose()
  id: string;
  @Expose()
  totalAmount: number;
  @Expose()
  @Type(() => CreditCustomerResponseDto)
  customer: CreditCustomerResponseDto;
  @Expose()
  installment: number;
  @Expose()
  @Type(() => CreditSaleInstallmentResponseDto)
  installments: CreditSaleInstallmentResponseDto[];
  @Expose()
  status: CreditSaleStatusEnum;
  @Expose()
  date: Date;
  @Expose()
  @Type(() => ProductResponseDto)
  products: ProductResponseDto[];
}
