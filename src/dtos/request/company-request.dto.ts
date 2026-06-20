import { IsString, IsEmail, IsNumber, IsNotEmpty } from 'class-validator';

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

  // date removido do DTO pois não é enviado pelo frontend
}
