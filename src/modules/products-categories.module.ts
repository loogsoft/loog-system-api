import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategoriesController } from 'src/controller/products-categories.controller';
import { ProductsCategoriesEntity } from 'src/entities/products-categories.entity';
import { ProductsCategoriesService } from 'src/services/products-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsCategoriesEntity])],
  controllers: [ProductsCategoriesController],
  providers: [ProductsCategoriesService],
  exports: [ProductsCategoriesService],
})
export class ProductsCategoriesModule {}
