import {
  IsEnum,
  IsInt,
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  Min,
} from 'class-validator';
import { StockMovementType } from '../../entities/stock-movement.entity';

export class StockMovementRequestDto {
  @IsUUID()
  @IsNotEmpty()
  variationId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsEnum(StockMovementType)
  type: StockMovementType;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  responsibleName: string;

  @IsEmail()
  @IsNotEmpty()
  responsibleEmail: string;

  @IsOptional()
  @IsString()
  observation?: string;
}
