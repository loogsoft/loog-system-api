import { Injectable } from '@nestjs/common';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary.config';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'products',
          },

          (error, result) => {
            if (error) {
              reject(this.toUploadError(error));
              return;
            }

            if (!result) {
              reject(new Error('Cloudinary não retornou resultado do upload'));
              return;
            }

            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  private toUploadError(error: UploadApiErrorResponse): Error {
    return new Error(error.message || 'Erro ao enviar imagem para Cloudinary');
  }
}
