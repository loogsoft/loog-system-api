import { Expose } from 'class-transformer';

export class ProductVariationResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string | null;

  @Expose()
  barCode?: string | null;

  @Expose()
  price?: string | null;

  @Expose()
  stock?: number | null;

  @Expose()
  lowStock?: number | null;

  @Expose()
  activeLowStock?: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  color?: string | null;

  @Expose()
  size?: string | null;

  @Expose()
  imageUrl?: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
