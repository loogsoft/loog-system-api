import { CreditSaleStatusEnum } from 'src/dtos/enums/credit-sale-status.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('credit-sale')
export class CreditSaleEntity {
  // ID único da venda no crediário
  @PrimaryGeneratedColumn()
  id: string;

  // Valor total da compra
  @Column({ nullable: false })
  totalAmount: number;

  // Quantidade de parcelas
  @Column({ nullable: false })
  installment: number;

  // Status da venda (pendente, pago, atrasado, etc)
  @Column({ nullable: false })
  status: CreditSaleStatusEnum;

  // Data da venda
  @Column()
  date: Date;

  @OneToMany(() => ProductEntity, (product) => product.creditSale, {
    nullable: false,
  })
  products: ProductEntity[];
}
