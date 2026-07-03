import { Expose } from 'class-transformer';

export class ProductsCategoriesResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  companyId: string;
}
