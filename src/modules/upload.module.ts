import { Module } from '@nestjs/common';

import { UploadController } from 'src/controller/upload.controller';

import { UploadService } from 'src/services/upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
