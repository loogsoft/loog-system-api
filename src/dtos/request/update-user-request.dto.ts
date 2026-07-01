import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserRequestDto } from './user-request.dto';

export class UpdateUserRequestDto extends PartialType(
  OmitType(UserRequestDto, ['companyId', 'userType'] as const),
) {}
