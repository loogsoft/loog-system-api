import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ImageEntity } from './image.entity';

import { ProductCategoryEnum } from 'src/dtos/enums/product-category.enum';

import { ProductStatusEnum } from 'src/dtos/enums/product-status.enum';

import { SupplierEntity } from './supplier.entity';

import { ProductVariationEntity } from './product-variation.entity';
import { CreditSaleEntity } from './credit-sale.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    length: 180,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Index()
  @Column({
    type: 'enum',
    enum: ProductCategoryEnum,
  })
  category: ProductCategoryEnum;

  @Column({
    type: 'enum',

    enum: ProductStatusEnum,

    default: ProductStatusEnum.ACTIVED,
  })
  status: ProductStatusEnum;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  price?: number | null;

  @Index()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  color?: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  size?: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  promoPrice?: number | null;

  @Column({ type: 'boolean', nullable: true, default: false })
  activeLowStock?: boolean;

  @Column({ type: 'int', nullable: true, default: null })
  stock?: number | null;

  @Column({ type: 'int', default: 0 })
  lowStock: number;

  @Column({
    nullable: true,
  })
  coverImage?: string;

  @OneToMany(() => ImageEntity, (image) => image.product, {
    cascade: true,
    eager: true,
  })
  images: ImageEntity[];

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'supplier_id',
  })
  supplier?: SupplierEntity;

  @OneToMany(() => ProductVariationEntity, (variation) => variation.product, {
    cascade: true,
    eager: true,
  })
  variations: ProductVariationEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CreditSaleEntity, (credit) => credit.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'credit_sale_id',
  })
  creditSale?: CreditSaleEntity;
}
