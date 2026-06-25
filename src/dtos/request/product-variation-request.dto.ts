import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  MaxLength,
  Min,
} from 'class-validator';

export class ProductVariationRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  barCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsBoolean()
  activeLowStock?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  lowStock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  @MaxLength(50)
  color: string;

  @IsString()
  @MaxLength(50)
  size: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
