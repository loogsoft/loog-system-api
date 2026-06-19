import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { CreditSaleStatusEnum } from '../enums/credit-sale-status.enum';
import { CreditSaleInstallmentRequestDto } from './credit-sale-installment-request.dto';

export class CreditSaleRequestDto {
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  installment: number;

  @IsEnum(CreditSaleStatusEnum)
  @IsNotEmpty()
  status: CreditSaleStatusEnum;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  productIds: string[];
}
