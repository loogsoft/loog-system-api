import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizesController } from 'src/controller/prizes.controller';
import { Prize } from 'src/entities/prizes.entity';
import { PrizesService } from 'src/services/prizes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prize])],
  providers: [PrizesService],
  controllers: [PrizesController],
  exports: [PrizesService],
})
export class PrizesModule {}
