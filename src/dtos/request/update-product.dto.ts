import { PartialType } from '@nestjs/mapped-types';
import { ProductRequestDto } from './product-request.dto';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductRequestDto extends PartialType(ProductRequestDto) {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => {
    const transformValue = value as unknown;

    if (typeof transformValue === 'string') {
      try {
        const parsed = JSON.parse(transformValue) as unknown;
        if (Array.isArray(parsed)) return parsed as unknown;
      } catch {
        return transformValue;
      }
    }
    return transformValue;
  })
  imageIds?: string[];
}
