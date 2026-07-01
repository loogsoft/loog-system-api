import { Expose } from 'class-transformer';

export class ProductImageResponseDto {
  @Expose()
  id: string;

  @Expose()
  fileName: string;

  @Expose()
  url: string;

  @Expose()
  publicId?: string;

  @Expose()
  isPrimary?: boolean;
}
