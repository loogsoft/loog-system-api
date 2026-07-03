import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimString } from './dto-transformers';

export class ProductsCategoriesRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => trimString(value))
  name: string;
}
