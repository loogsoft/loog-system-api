import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { ImageEntity } from './image.entity';

@Entity('suppliers')
export class SupplierEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ length: 120, nullable: true })
  category?: string;

  @OneToMany(() => ImageEntity, (image) => image.supplier, {
    cascade: true,
    eager: true,
  })
  images?: ImageEntity[];

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ length: 180, nullable: true })
  location?: string;

  @Column({ length: 16, default: 'active' })
  status: string;

  @Column({ length: 16, nullable: true })
  avatarColor?: string;

  @Column({ type: 'int', default: 0 })
  openOrders: number;

  @OneToMany(() => ProductEntity, (product) => product.supplier, {
    nullable: true,
  })
  products?: ProductEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
