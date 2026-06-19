import { IsNotEmpty } from 'class-validator';

export class ProductCategoryRequestDto {
  @IsNotEmpty()
  name: string;
}
