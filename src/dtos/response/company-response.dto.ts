import { Expose } from 'class-transformer';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';

export class CompanyResponseDto {
  @Expose()
  id: string;

  @Expose()
  companyName: string;

  @Expose()
  paymentDueDay: Date;

  @Expose()
  subscriptionStatus: SubscriptionStatusEnum;

  @Expose()
  companyEmail: string;

  @Expose()
  companyPhone: number;

  @Expose()
  companyCpfCnpj: number;

  @Expose()
  color: string;

  @Expose()
  imageUrl?: string | null;

  @Expose()
  date: Date;
}
