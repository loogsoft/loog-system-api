import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
  Max,
  MaxLength,
  Min,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  optionalBoolean,
  optionalNumber,
  optionalTrimmedString,
  trimString,
} from './dto-transformers';

export class PrizeRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => trimString(value))
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Transform(({ value }) => trimString(value))
  description: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2500)
  @Transform(({ value }) => optionalTrimmedString(value))
  imageUrl?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(2147483647)
  @Transform(({ value }) => optionalNumber(value))
  quantity: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Transform(({ value }) => optionalNumber(value))
  probability: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBoolean(value))
  active?: boolean;
}
