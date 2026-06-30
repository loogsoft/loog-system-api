import { Injectable } from '@nestjs/common';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { ImageEntity } from 'src/entities/image.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import cloudinary from 'src/config/cloudinary.config';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly repo: Repository<ImageEntity>,
  ) {}

  async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
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

  async createImages(
    files: Express.Multer.File[],
    companyId: string,
  ): Promise<ImageEntity[]> {
    const images: ImageEntity[] = [];
    for (const file of files) {
      const uploadResult = await this.uploadToCloudinary(file);
      const image = this.repo.create({
        companyId,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
      images.push(image);
    }
    return images;
  }

  async deleteImages(imageIds: string[], companyId: string): Promise<void> {
    const images = await this.repo.find({
      where: { id: In(imageIds), companyId },
    });

    for (const image of images) {
      await cloudinary.uploader.destroy(image.publicId);
      await this.repo.remove(image);
    }
  }

  private toUploadError(error: UploadApiErrorResponse): Error {
    return new Error(error.message || 'Erro ao enviar imagem para Cloudinary');
  }
}
