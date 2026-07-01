import {
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  Min,
  Max,
  MaxLength,
  IsIn,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { StockMovementType } from '../../entities/stock-movement-type.enum';
import {
  lowercaseEmail,
  optionalNumber,
  optionalTrimmedString,
  trimString,
} from './dto-transformers';

const PAYMENT_METHODS = [
  'PIX',
  'Dinheiro',
  'Crédito',
  'Débito',
  'Crediario',
] as const;

export class StockMovementItemDto {
  @IsOptional()
  @IsUUID('4')
  variationId?: string;

  @IsOptional()
  @IsUUID('4')
  productId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2147483647)
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  @Transform(({ value }) => optionalTrimmedString(value))
  productName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/)
  @MaxLength(16)
  @Transform(({ value }) => optionalTrimmedString(value))
  price?: string;
}

export class StockMovementRequestDto {
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  @IsOptional()
  @IsUUID('4')
  variationId?: string;

  @IsOptional()
  @IsUUID('4')
  productId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2147483647)
  @Transform(({ value }) => optionalNumber(value))
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  @Transform(({ value }) => optionalTrimmedString(value))
  productName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/)
  @MaxLength(16)
  @Transform(({ value }) => optionalTrimmedString(value))
  price?: string;

  @IsOptional()
  @IsUUID('4')
  creditCustomerId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(120)
  @Transform(({ value }) => optionalNumber(value))
  installment?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => StockMovementItemDto)
  items?: StockMovementItemDto[];

  @IsEnum(StockMovementType)
  type: StockMovementType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  @Transform(({ value }) => trimString(value))
  reason: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(PAYMENT_METHODS)
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => trimString(value))
  responsibleName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @Transform(({ value }) => lowercaseEmail(value))
  responsibleEmail: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }) => optionalTrimmedString(value))
  observation?: string;
}
