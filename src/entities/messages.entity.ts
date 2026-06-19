import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  productId: string;

  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false, default: 'low_stock' })
  type: string;

  @CreateDateColumn()
  date: Date;
}
