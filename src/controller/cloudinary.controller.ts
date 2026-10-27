import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from '../services/cloudinary.service';
import type { CloudinaryImageResponse } from '../services/cloudinary.service';
import type { AuthenticatedRequest } from '../types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('images')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    }),
  )
  uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ })
        .build(),
    )
    file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ): Promise<CloudinaryImageResponse> {
    return this.cloudinaryService.uploadImage(file, req.user.companyId);
  }
}
