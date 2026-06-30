import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_categories')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  companyId?: string;

  @Column()
  name: string;

  @Column()
  tradution: string;
}
