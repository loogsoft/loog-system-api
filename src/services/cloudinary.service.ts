import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiOptions } from 'cloudinary';

export type CloudinaryImageResponse = {
  url: string;
  publicId: string;
};

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {}

  async uploadImage(
    file: Express.Multer.File,
    companyId: string,
  ): Promise<CloudinaryImageResponse> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Envie uma imagem válida para o upload.');
    }

    if (!companyId) {
      throw new BadRequestException(
        'A empresa do usuário não foi identificada.',
      );
    }

    const cloudName = this.configService
      .get<string>('CLOUDINARY_CLOUD_NAME')
      ?.trim();
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY')?.trim();
    const apiSecret = this.configService
      .get<string>('CLOUDINARY_API_SECRET')
      ?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      throw new ServiceUnavailableException(
        'Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET na API.',
      );
    }

    // A configuração é lida após o Nest carregar as variáveis de ambiente.
    const options: UploadApiOptions = {
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
      resource_type: 'image',
      folder: `publications/${companyId}`,
      format: 'jpg',
      timeout: 60_000,
    };

    return new Promise<CloudinaryImageResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) {
            const message = error.message
              .replaceAll(apiKey, '[redigido]')
              .replaceAll(apiSecret, '[redigido]');
            this.logger.error(
              `Falha ao enviar imagem para o Cloudinary: ${message}`,
            );
            reject(
              new BadGatewayException(
                'Não foi possível hospedar a imagem no Cloudinary. Tente novamente.',
              ),
            );
            return;
          }

          if (
            !result?.secure_url?.startsWith('https://') ||
            !result.public_id
          ) {
            reject(
              new BadGatewayException(
                'O Cloudinary não retornou uma URL válida para a imagem.',
              ),
            );
            return;
          }

          resolve({ url: result.secure_url, publicId: result.public_id });
        })
        .end(file.buffer);
    });
  }
}
