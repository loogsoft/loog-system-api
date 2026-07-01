import { IsEnum, IsNotEmpty } from 'class-validator';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';

export class UpdateSubscriptionRequestDto {
  @IsEnum(SubscriptionStatusEnum)
  @IsNotEmpty()
  status: SubscriptionStatusEnum;
}
