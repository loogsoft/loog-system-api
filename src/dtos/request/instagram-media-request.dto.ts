import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { trimString } from './dto-transformers';

export class InstagramMediaRequestDto {
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsUrl(
    { protocols: ['https'], require_protocol: true, disallow_auth: true },
    { message: 'A imagem precisa estar hospedada em uma URL HTTPS válida.' },
  )
  @MaxLength(2500)
  imageUrl: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty({ message: 'Informe a legenda da publicação.' })
  @MaxLength(2200, { message: 'A legenda deve ter no máximo 2200 caracteres.' })
  caption: string;
}
