import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product_variations')
@Index(['product', 'color', 'size'], { unique: true })
export class ProductVariationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    length: 50,
    unique: true,
    nullable: true,
  })
  barCode?: string;

  @Index()
  @Column({ length: 120 })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price?: number | null;

  @Column({ type: 'boolean', nullable: true, default: false })
  activeLowStock?: boolean;

  @Column({ type: 'int', nullable: true })
  stock?: number | null;

  @Column({ type: 'int', nullable: true })
  lowStock?: number | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  color?: string;

  @Column({ nullable: true })
  size?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => ProductEntity, (product) => product.variations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
