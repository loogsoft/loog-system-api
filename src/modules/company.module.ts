import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { CompanyController } from 'src/controller/company.controller';
import { CompanyService } from 'src/services/company.service';
import { AsaasModule } from 'src/asaas/asaas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
    PassportModule,
    forwardRef(() => AsaasModule),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
