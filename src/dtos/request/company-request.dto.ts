import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Matches,
  IsHexColor,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  digitsOnly,
  lowercaseEmail,
  optionalTrimmedString,
  trimString,
} from './dto-transformers';

export class CompanyRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => trimString(value))
  companyName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @Transform(({ value }) => lowercaseEmail(value))
  companyEmail: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,11}$/, { message: 'formato de telefone inválido' })
  @Transform(({ value }) => digitsOnly(value))
  companyPhone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{11}|\d{14})$/, { message: 'formato de CPF/CNPJ inválido' })
  @Transform(({ value }) => digitsOnly(value))
  companyCpfCnpj: string;

  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  @MaxLength(9)
  @Transform(({ value }) => trimString(value))
  color: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2500)
  @Transform(({ value }) => optionalTrimmedString(value))
  imageUrl?: string;

  // date removido do DTO pois não é enviado pelo frontend
}
