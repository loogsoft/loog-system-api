import { Expose, Type } from 'class-transformer';
import { StockMovementType } from '../../entities/stock-movement-type.enum';
import { ProductVariationResponseDto } from './product-variation-response.dto';

export class StockMovementResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => ProductVariationResponseDto)
  variation: ProductVariationResponseDto;

  @Expose()
  productId?: string;

  @Expose()
  variationId?: string;

  @Expose()
  quantity: number;

  @Expose()
  productName: string;

  @Expose()
  type: StockMovementType;

  @Expose()
  reason: string;

  @Expose()
  price: string;

  @Expose()
  paymentMethod: string;

  @Expose()
  responsibleName: string;

  @Expose()
  responsibleEmail: string;

  @Expose()
  observation?: string;

  @Expose()
  createdAt: Date;
}
