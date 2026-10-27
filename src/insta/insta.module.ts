import { Module } from '@nestjs/common';
import { InstaController } from './insta.controller';
import { InstaService } from './insta.service';

@Module({
  controllers: [InstaController],
  providers: [InstaService],
})
export class InstaModule {}
