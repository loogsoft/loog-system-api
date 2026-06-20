import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ProductEntity } from './product.entity';
import { SupplierEntity } from './supplier.entity';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.images, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;
}
