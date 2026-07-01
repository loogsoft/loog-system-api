import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsUUID,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserTypeEnum } from '../enums/user-type.enum';
import { lowercaseEmail, trimString } from './dto-transformers';

export class UserRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => trimString(value))
  name: string;

  @IsUUID('4')
  @IsNotEmpty()
  companyId: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @Transform(({ value }) => lowercaseEmail(value))
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  password: string;

  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  userType: UserTypeEnum;
}
