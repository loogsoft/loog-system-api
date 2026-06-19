import { Expose, Type } from 'class-transformer';
import { ProductCategoryEnum } from '../enums/product-category.enum';
import { ProductImageResponseDto } from './product-images-response.tdo';
import { ProductStatusEnum } from '../enums/product-status.enum';
import { ProductVariationResponseDto } from './product-variation-response.dto';
import { SupplierResponseDto } from './supplier-response.dto';

export class ProductResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  category: ProductCategoryEnum;

  @Expose()
  status: ProductStatusEnum;

  @Expose()
  price: string | null;

  @Expose()
  color?: string | null;

  @Expose()
  size?: string | null;

  @Expose()
  promoPrice?: string | null;

  @Expose()
  activeLowStock?: boolean;

  @Expose()
  stock: number | null;

  @Expose()
  lowStock: number;

  @Expose()
  @Type(() => ProductImageResponseDto)
  images: ProductImageResponseDto[];

  @Expose()
  @Type(() => ProductVariationResponseDto)
  variations?: ProductVariationResponseDto[];

  @Expose()
  @Type(() => SupplierResponseDto)
  supplier?: SupplierResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
