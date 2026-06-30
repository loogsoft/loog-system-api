import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/services/upload.service';


@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<{
    url: string;
  }> {
    const result = await this.uploadService.uploadImage(file);

    return {
      url: result.secure_url,
    };
  }
}
