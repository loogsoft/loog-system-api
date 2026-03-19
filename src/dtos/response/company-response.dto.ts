import { Expose } from 'class-transformer';

export class CompanyResponseDto {
  @Expose()
  id: string;

  @Expose()
  companyName: string;

  @Expose()
  companyEmail: string;

  @Expose()
  companyPhone: number;

  @Expose()
  companyCpfCnpj: number;

  @Expose()
  color: string;

  @Expose()
  date: Date;
}
