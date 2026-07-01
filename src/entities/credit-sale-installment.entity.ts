import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { CreditSaleEntity } from './credit-sale.entity';
import { CreditSaleInstallmentStatusEnum } from 'src/dtos/enums/credit-sale-instalment-status.enum';

@Entity('credit-sale-installment')
export class CreditSaleInstallmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  companyId?: string;

  @ManyToOne(() => CreditSaleEntity, (sale) => sale.installments, {
    onDelete: 'CASCADE',
  })
  creditSale: CreditSaleEntity;

  @Column()
  installmentNumber: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({ nullable: false })
  status: CreditSaleInstallmentStatusEnum;
}
