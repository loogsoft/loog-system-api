import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ProductVariationEntity } from './product-variation.entity';
import { StockOperationEntity } from './stock-operation.entity';
import { ProductEntity } from './product.entity';
import { StockMovementType } from './stock-movement-type.enum';

export { StockMovementType } from './stock-movement-type.enum';

@Entity('stock_movements')
export class StockMovementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  operationId?: string;

  @ManyToOne(() => StockOperationEntity, (operation) => operation.movements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'operationId' })
  operation: StockOperationEntity;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;

  @ManyToOne(() => ProductEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'productId' })
  product?: ProductEntity | null;

  @Column({ type: 'uuid', nullable: true })
  variationId?: string;

  @ManyToOne(() => ProductVariationEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'variationId' })
  variation?: ProductVariationEntity | null;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  productName?: string;

  @Column({ nullable: true })
  price?: string;

  /**
   * Campos legados mantidos para preservar o histórico antigo da tabela
   * stock_movements. Novas baixas usam StockOperationEntity como origem
   * principal desses dados.
   */
  @Column({ type: 'uuid', nullable: true })
  companyId?: string;

  @Column({
    type: 'enum',
    enum: StockMovementType,
    nullable: true,
  })
  type?: StockMovementType;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ nullable: true })
  responsibleName?: string;

  @Column({ nullable: true })
  responsibleEmail?: string;

  @Column({ nullable: true })
  observation?: string;

  @CreateDateColumn()
  createdAt: Date;
}
