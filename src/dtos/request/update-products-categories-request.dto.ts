import { PartialType } from '@nestjs/mapped-types';
import { ProductsCategoriesRequestDto } from './products-categories-request.dto';

export class UpdateProductsCategoriesRequestDto extends PartialType(
  ProductsCategoriesRequestDto,
) {}
