import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsTaxId,
  MaxLength,
} from 'class-validator';
import {
  digitsOnly,
  lowercaseEmail,
  trimString,
} from '../../dtos/request/dto-transformers';

export class RequestAssasDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => trimString(value))
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsTaxId('pt-BR', { message: 'CPF ou CNPJ inválido.' })
  @Transform(({ value }) => digitsOnly(value))
  cpfCnpj: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @Transform(({ value }) => lowercaseEmail(value))
  email: string;
}
