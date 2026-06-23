import {
  IsString,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CompanyRequestDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;

  @IsNumber()
  @IsNotEmpty()
  companyPhone: number;

  @IsNumber()
  @IsNotEmpty()
  companyCpfCnpj: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  // date removido do DTO pois não é enviado pelo frontend
}
