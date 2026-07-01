import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimString } from './dto-transformers';

export class ProductCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => trimString(value))
  name: string;
}
