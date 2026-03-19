import { UserTypeEnum } from 'src/dtos/enums/user-type.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  companyId: string;
  
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserTypeEnum,
    default: UserTypeEnum.SELLER,
  })
  userType: UserTypeEnum;

  @Column({ type: 'varchar', nullable: true })
  verificationCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  codeExpiresAt: Date | null;
}
