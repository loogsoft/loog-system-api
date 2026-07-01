import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { CreditSaleInstallmentStatusEnum } from '../enums/credit-sale-instalment-status.enum';

export class CreditSaleInstallmentRequestDto {
  @IsUUID('4')
  @IsNotEmpty()
  creditSaleId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(120)
  @IsNotEmpty()
  installmentNumber: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(99999999.99)
  @IsNotEmpty()
  amount: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dueDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  paidAt?: Date;

  @IsEnum(CreditSaleInstallmentStatusEnum)
  @IsNotEmpty()
  status: CreditSaleInstallmentStatusEnum;
}
