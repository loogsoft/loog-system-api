import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { CompanyController } from 'src/controller/company.controller';
import { CompanyService } from 'src/services/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), PassportModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
