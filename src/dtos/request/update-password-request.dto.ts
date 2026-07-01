import {
  IsString,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class UpdatePasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  defaultPassword: string;

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
  newPassword: string;
}
