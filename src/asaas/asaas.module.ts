import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AsaasService } from './asaas.service';
import { AsaasController } from './asaas.controller';
import { CompanyModule } from 'src/modules/company.module';

@Module({
  imports: [HttpModule, forwardRef(() => CompanyModule)],
  controllers: [AsaasController],
  providers: [AsaasService],
  exports: [AsaasService],
})
export class AsaasModule { }