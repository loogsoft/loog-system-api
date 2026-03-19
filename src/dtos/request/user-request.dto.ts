import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { UserTypeEnum } from '../enums/user-type.enum';

export class UserRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  userType: UserTypeEnum;
}
