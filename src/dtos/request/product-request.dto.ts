import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
  ValidateNested,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  Max,
} from 'class-validator';
import { ProductCategoryEnum } from '../enums/product-category.enum';
import { ProductVariationRequestDto } from './product-variation-request.dto';
import { ProductStatusEnum } from '../enums/product-status.enum';
import {
  nullableNumber,
  optionalNumber,
  optionalTrimmedString,
  trimString,
} from './dto-transformers';

export class ProductRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => optionalTrimmedString(value))
  barCode?: string;

  @IsString()
  @IsNotEmpty({ message: 'Campo nome vazio' })
  @MaxLength(180)
  @Transform(({ value }) => trimString(value))
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2500)
  @Transform(({ value }) => optionalTrimmedString(value))
  description?: string;

  @IsEnum(ProductCategoryEnum)
  category: ProductCategoryEnum;

  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum;

  @Transform(({ value }) => optionalNumber(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Preço deve ser número' })
  @Min(0, { message: 'Preço não pode ser negativo' })
  @Max(9999999999.99)
  @IsOptional()
  price?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => optionalTrimmedString(value))
  color?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => optionalTrimmedString(value))
  size?: string | null;

  @IsOptional()
  @Transform(({ value }) => nullableNumber(value))
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Preço promocional deve ser número' },
  )
  @Min(0, { message: 'Preço promocional não pode ser negativo' })
  @Max(9999999999.99)
  promoPrice?: number | null;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  activeLowStock?: boolean;

  @IsOptional()
  @Transform(({ value }) => optionalNumber(value))
  @IsInt({ message: 'Estoque deve ser inteiro' })
  @Min(0, { message: 'Estoque não pode ser negativo' })
  @Max(2147483647)
  stock?: number | null;

  @Transform(({ value }) => optionalNumber(value))
  @IsInt({ message: 'LowStock deve ser inteiro' })
  @Min(0, { message: 'LowStock não pode ser negativo' })
  @Max(2147483647)
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
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => ProductVariationRequestDto)
  variations?: ProductVariationRequestDto[];

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === 'null' ? null : (value as unknown),
  )
  @IsUUID('4')
  supplierId?: string | null;
}
