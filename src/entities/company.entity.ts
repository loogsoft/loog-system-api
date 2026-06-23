import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('company')
export class CompanyEntity {
  // ID único da empresa
  @PrimaryGeneratedColumn()
  id: string;

  // Nome da empresa
  @Column({ nullable: false })
  companyName: string;

  // Email da empresa
  @Column({ nullable: false })
  companyEmail: string;

  // Telefone da empresa

  @Column({ nullable: false, type: 'bigint' })
  companyPhone: number;

  // CPF ou CNPJ da empresa

  @Column({ nullable: false, type: 'bigint' })
  companyCpfCnpj: number;

  // Cor da empresa
  @Column({ nullable: false })
  color: string;

  // URL da logo personalizada da empresa
  @Column({ type: 'text', nullable: true })
  imageUrl?: string | null;

  // Data da venda
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
