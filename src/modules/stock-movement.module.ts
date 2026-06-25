import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementEntity } from 'src/entities/stock-movement.entity';
import { StockMovementController } from 'src/controller/stock-movement.controller';
import { StockMovementService } from 'src/services/stock-movement.service';
import { ProductVariationEntity } from 'src/entities/product-variation.entity';
import { StockOperationModule } from 'src/modules/stock-operation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockMovementEntity, ProductVariationEntity]),
    StockOperationModule,
  ],
  controllers: [StockMovementController],
  providers: [StockMovementService],
})
export class StockMovementModule {}
