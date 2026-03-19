import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';
import { CreditSaleStatusEnum } from '../enums/credit-sale-status.enum';

export class CreditSaleRequestDto {
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

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
