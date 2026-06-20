import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
  ValidateNested,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

import { ProductCategoryEnum } from '../enums/product-category.enum';
import { ProductVariationRequestDto } from './product-variation-request.dto';
import { ProductStatusEnum } from '../enums/product-status.enum';

export class ProductRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Campo nome vazio' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ProductCategoryEnum)
  category: ProductCategoryEnum;

  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum;

  // ⚠ CORREÇÃO IMPORTANTE
  @Type(() => Number)
  @IsNumber({}, { message: 'Preço deve ser número' })
  @Min(0, { message: 'Preço não pode ser negativo' })
  @IsOptional()
  price?: number | null;

  @IsOptional()
  @IsString()
  color?: string | null;

  @IsOptional()
  @IsString()
  size?: string | null;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === 'null' || value === null ? null : Number(value),
  )
  @IsNumber({}, { message: 'Preço promocional deve ser número' })
  @Min(0, { message: 'Preço promocional não pode ser negativo' })
  promoPrice?: number | null;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  activeLowStock?: boolean;

  // ⚠ CORREÇÃO IMPORTANTE
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Estoque deve ser inteiro' })
  @Min(0, { message: 'Estoque não pode ser negativo' })
  stock?: number | null;

  // ⚠ CORREÇÃO IMPORTANTE
  @Type(() => Number)
  @IsInt({ message: 'LowStock deve ser inteiro' })
  @Min(0, { message: 'LowStock não pode ser negativo' })
  lowStock: number;

  @IsOptional()
  @Transform(({ value }) => {
    const transformValue = value as unknown;

    if (typeof transformValue === 'string') {
      try {
        const parsed = JSON.parse(transformValue) as unknown;
        if (Array.isArray(parsed)) {
          return plainToInstance(ProductVariationRequestDto, parsed);
        }
        return parsed;
      } catch {
        return transformValue;
      }
    }
    if (Array.isArray(transformValue)) {
      return plainToInstance(ProductVariationRequestDto, transformValue);
    }
    return transformValue;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariationRequestDto)
  variations?: ProductVariationRequestDto[];

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === 'null' ? null : (value as unknown),
  )
  @IsUUID()
  supplierId?: string | null;
}
