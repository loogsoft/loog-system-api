import { Expose } from 'class-transformer';

export class MessageResponseDto {
  @Expose()
  id: string;

  @Expose()
  productId: string;

  @Expose()
  name: string;

  @Expose()
  url: string;

  @Expose()
  description: string;

  @Expose()
  type: string;

  @Expose()
  date: Date;
}
