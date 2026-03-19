import { Expose } from 'class-transformer';
import { UserTypeEnum } from '../enums/user-type.enum';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  companyId: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  userType: UserTypeEnum;
}
