import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UploadController } from 'src/controller/upload.controller';

import { UploadService } from 'src/services/upload.service';
import { CloudinaryController } from '../controller/cloudinary.controller';
import { CloudinaryService } from '../services/cloudinary.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController, CloudinaryController],
  providers: [UploadService, CloudinaryService],
})
export class UploadModule {}
