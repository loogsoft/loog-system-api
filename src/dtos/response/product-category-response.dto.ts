import { Expose } from 'class-transformer';

export class ProductCategoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}
