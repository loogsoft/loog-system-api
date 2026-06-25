import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StockMovementType } from '../../entities/stock-movement-type.enum';

export class StockMovementItemDto {
  @IsOptional()
  @IsUUID()
  variationId?: string;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  price?: string;
}

export class StockMovementRequestDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  variationId?: string;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  creditCustomerId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  installment?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StockMovementItemDto)
  items?: StockMovementItemDto[];

  @IsEnum(StockMovementType)
  type: StockMovementType;

  @IsString()
  @IsNotEmpty()
  reason: string;

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
