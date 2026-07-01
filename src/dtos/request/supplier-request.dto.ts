import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  IsIn,
  IsInt,
  Min,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  optionalDigitsOnly,
  optionalLowercaseEmail,
  optionalNumber,
  optionalTrimmedString,
  trimString,
} from './dto-transformers';

const SUPPLIER_STATUS = ['active', 'inactive'] as const;

export class SupplierRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  @Transform(({ value }) => trimString(value))
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => optionalTrimmedString(value))
  category?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }) => optionalLowercaseEmail(value))
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @Matches(/^\d{10,15}$/)
  @Transform(({ value }) => optionalDigitsOnly(value))
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  @Transform(({ value }) => optionalTrimmedString(value))
  location?: string;

  @IsOptional()
  @IsIn(SUPPLIER_STATUS)
  @Transform(({ value }) => optionalTrimmedString(value))
  status?: (typeof SUPPLIER_STATUS)[number];

  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Transform(({ value }) => optionalTrimmedString(value))
  avatarColor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Transform(({ value }) => optionalNumber(value))
  openOrders?: number;
}
