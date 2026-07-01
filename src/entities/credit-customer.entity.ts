import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CreditSaleEntity } from './credit-sale.entity';

@Entity('credit-customer')
export class CreditCustomerEntity {
  // ID único da venda no crediário
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @OneToMany(() => CreditSaleEntity, (creditSale) => creditSale.customer, {
    nullable: true,
  })
  creditSales: CreditSaleEntity[];

  // Nome do cliente
  @Column({ nullable: false })
  customerName: string;

  // Email do cliente
  @Column({ unique: true })
  customerEmail: string;

  // CPF do cliente
  @Column({ nullable: false, unique: true })
  CPF: string;

  // Telefone do cliente
  @Column({ nullable: false })
  phone: string;

  // Rua do endereço
  @Column({ nullable: false })
  road: string;

  // Número do endereço
  @Column({ nullable: false })
  number: string;

  // Bairro do endereço
  @Column({ nullable: false })
  neighborhood: string;

  // Cidade do endereço
  @Column({ nullable: false })
  city: string;

  // Estado do endereço
  @Column({ nullable: false })
  state: string;

  // CEP do endereço
  @Column({ nullable: false })
  zipCode: string;

  // Valor total de compras
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: false,
    default: 0,
  })
  totalAmounts: number;

  // Data da venda
  @CreateDateColumn({ type: 'timestamp' })
  date: Date;
}
