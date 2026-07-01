import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  digitsOnly,
  lowercaseEmail,
  trimString,
  uppercaseString,
} from './dto-transformers';

export class CreditCustomerRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => trimString(value))
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @Transform(({ value }) => lowercaseEmail(value))
  customerEmail: string;

  @IsString()
  @Matches(/^\d{11}$/)
  @IsNotEmpty()
  @Transform(({ value }) => digitsOnly(value))
  CPF: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,11}$/)
  @Transform(({ value }) => digitsOnly(value))
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  @Transform(({ value }) => trimString(value))
  road: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Transform(({ value }) => trimString(value))
  number: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => trimString(value))
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => trimString(value))
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @Matches(/^[A-Za-z]{2}$/)
  @Transform(({ value }) => uppercaseString(value))
  state: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/)
  @Transform(({ value }) => digitsOnly(value))
  zipCode: string;
}
