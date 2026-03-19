import { Expose } from 'class-transformer';

export class CreditCustomerResponseDto {
  @Expose()
  id: string;
  @Expose()
  customerName: string;
  @Expose()
  customerEmail: string;
  @Expose()
  CPF: string;
  @Expose()
  phone: string;
  @Expose()
  road: string;
  @Expose()
  number: string;
  @Expose()
  neighborhood: string;
  @Expose()
  city: string;
  @Expose()
  state: string;
  @Expose()
  zipCode: string;
  @Expose()
  totalAmounts?: number;
  @Expose()
  date: Date;
}
