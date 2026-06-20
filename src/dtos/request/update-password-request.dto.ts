import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  defaultPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
