import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsUrl,
  MaxLength,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { optionalTrimmedString, trimString } from './dto-transformers';

const MESSAGE_TYPES = ['esgotado', 'estoque_baixo'] as const;

export class MessageRequestDto {
  @IsUUID('4')
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  @Transform(({ value }) => trimString(value))
  name: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2500)
  @Transform(({ value }) => optionalTrimmedString(value))
  url?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Transform(({ value }) => trimString(value))
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(MESSAGE_TYPES)
  type: string;
}
