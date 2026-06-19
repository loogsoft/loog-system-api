import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UpdatePasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  defaultPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
