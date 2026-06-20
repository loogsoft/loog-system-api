import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from 'src/entities/supplier.entity';
import { ImageEntity } from 'src/entities/image.entity'; // Adicione esta linha
import { SuppliersService } from 'src/services/supplier.service';
import { SuppliersController } from 'src/controller/supplier.controller';
import { ImageService } from 'src/services/image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierEntity, ImageEntity]), // Adicione ImageEntity aqui
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService, ImageService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
