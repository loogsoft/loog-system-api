import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductsModule } from './modules/products.module';
import { UserModule } from './modules/user.module';
import { EmailModule } from './modules/email.module';
import { SuppliersModule } from './modules/supplier.module';
import { HealthModule } from './modules/health.module';
import { UploadModule } from './modules/upload.module';
import { StockMovementModule } from './modules/stock-movement.module';
import { MessageModule } from './modules/message.module';
import { PrizesModule } from './modules/prizes.module';
import { CompanyModule } from './modules/company.module';
import { CreditSaleModule } from './modules/credit-sale.module';
import { CreditCustomerModule } from './modules/credit-customer.module';
import { CreditSaleInstallmentModule } from './modules/credit-sale-installment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ProductsModule,
    UserModule,
    EmailModule,
    SuppliersModule,
    HealthModule,
    UploadModule,
    StockMovementModule,
    MessageModule,
    PrizesModule,
    CompanyModule,
    CreditSaleModule,
    CreditSaleInstallmentModule,
    CreditCustomerModule,
    CreditCustomerModule,
  ],
})
export class AppModule {}
