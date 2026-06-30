import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UploadService } from 'src/services/upload.service';

@UseGuards(JwtAuthGuard)
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
