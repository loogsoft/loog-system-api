import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength } from 'class-validator';
import { trimString } from './dto-transformers';

export class InstagramContainerRequestDto {
  @Transform(({ value }) => trimString(value))
  @IsString()
  @Matches(/^\d+$/, { message: 'Informe um ID de mídia válido do Instagram.' })
  @MaxLength(100)
  containerId: string;
}
