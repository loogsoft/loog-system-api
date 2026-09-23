import { Expose, Type } from 'class-transformer';
import { ProductImageResponseDto } from './product-images-response.tdo';
import { ProductResponseDto } from './product-response.dto';

export class SupplierResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  category?: string;

  @Expose()
  email?: string;

  @Expose()
  phone?: string;

  @Expose()
  location?: string;

  @Expose()
  status?: string;

  @Expose()
  avatarColor?: string;

  @Expose()
  openOrders?: number;

  @Expose()
  linkSite?: string;

  @Expose()
  @Type(() => ProductResponseDto)
  products?: ProductResponseDto[];

  @Expose()
  @Type(() => ProductImageResponseDto)
  images?: ProductImageResponseDto[];
}
