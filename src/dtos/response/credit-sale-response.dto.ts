import { Expose } from 'class-transformer';
import { CreditSaleStatusEnum } from '../enums/credit-sale-status.enum';
import { ProductResponseDto } from './product-response.dto';

export class CreditSaleResponseDto {
  @Expose()
  id: string;
  @Expose()
  totalAmount: number;
  @Expose()
  installment: number;
  @Expose()
  status: CreditSaleStatusEnum;
  @Expose()
  date: Date;
  @Expose()
  products: ProductResponseDto[];
}
