import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { CreditSaleStatusEnum } from '../enums/credit-sale-status.enum';

export class CreditSaleRequestDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  @IsNotEmpty()
  totalAmount: number;

  @IsUUID('4')
  @IsNotEmpty()
  customerId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(120)
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
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  productIds: string[];
}
