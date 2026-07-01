import { Expose } from 'class-transformer';

export class PrizeResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  quantity: number;

  @Expose()
  probability: number;

  @Expose()
  active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
