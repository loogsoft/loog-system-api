import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  MaxLength,
  Min,
  Max,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  optionalBoolean,
  optionalNumber,
  optionalTrimmedString,
  trimString,
} from './dto-transformers';

export class ProductVariationRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => optionalTrimmedString(value))
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => optionalTrimmedString(value))
  barCode?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  @Transform(({ value }) => optionalNumber(value))
  price?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  stock: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBoolean(value))
  activeLowStock?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  @IsOptional()
  @Transform(({ value }) => optionalNumber(value))
  lowStock?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBoolean(value))
  isActive?: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => trimString(value))
  color: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => trimString(value))
  size: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2500)
  @Transform(({ value }) => optionalTrimmedString(value))
  imageUrl?: string;
}
