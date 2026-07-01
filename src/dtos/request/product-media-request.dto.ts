import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { optionalBoolean, trimString } from './dto-transformers';

export class ProductMediaRequestDto {
  @IsUUID('4')
  id: string;

  @IsString()
  @MaxLength(180)
  @Transform(({ value }) => trimString(value))
  name: string;

  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2500)
  @Transform(({ value }) => trimString(value))
  url: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBoolean(value))
  isPrimary?: boolean;
}
