import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockMovementEntity } from './stock-movement.entity';
import { StockMovementType } from './stock-movement-type.enum';

export { StockMovementType } from './stock-movement-type.enum';

@Entity('stock_operations')
export class StockOperationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @Column({
    type: 'enum',
    enum: StockMovementType,
  })
  type: StockMovementType;

  @Column()
  reason: string;

  @Column()
  paymentMethod: string;

  @Column()
  responsibleName: string;

  @Column()
  responsibleEmail: string;

  @Column({ nullable: true })
  observation?: string;

  @OneToMany(() => StockMovementEntity, (movement) => movement.operation, {
    cascade: true,
  })
  movements: StockMovementEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
