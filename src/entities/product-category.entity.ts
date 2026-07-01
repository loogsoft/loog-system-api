import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_categories')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  companyId?: string;

  @Column()
  name: string;

  @Column()
  tradution: string;
}
