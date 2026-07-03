import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products-categories')
export class ProductsCategoriesEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  companyId: string;
}
