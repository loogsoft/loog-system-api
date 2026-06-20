import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CreditSaleInstallmentStatusEnum } from '../enums/credit-sale-instalment-status.enum';

export class CreditSaleInstallmentRequestDto {
  @IsString()
  @IsNotEmpty()
  creditSaleId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  installmentNumber: number;

  @IsNumber()
  @Min(0)
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
