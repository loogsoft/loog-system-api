import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { isAxiosError } from 'axios';
import type {
  InstagramAccountDto,
  InstagramMediaResponseDto,
  InstagramMediaStatusDto,
} from '../dtos/response/instagram-response.dto';

const INSTAGRAM_API_URL = 'https://graph.instagram.com/v24.0';
const REQUEST_TIMEOUT = 30_000;

@Injectable()
export class InstaService {
  constructor(private readonly configService: ConfigService) {}

  async getAccount(): Promise<InstagramAccountDto> {
    const { accessToken, userId } = this.getCredentials();

    try {
      const response = await axios.get<InstagramAccountDto>(
        `${INSTAGRAM_API_URL}/${userId}`,
        {
          params: {
            fields: 'id,username,name,account_type',
            access_token: accessToken,
          },
          timeout: REQUEST_TIMEOUT,
        },
      );

      const { id, username, name, account_type } = response.data;
      return { id, username, name, account_type };
    } catch (error: unknown) {
      this.handleInstagramError(error);
    }
  }

  async criarMidia(
    imageUrl: string,
    caption: string,
  ): Promise<InstagramMediaResponseDto> {
    const { accessToken, userId } = this.getCredentials();

    try {
      const response = await axios.post<InstagramMediaResponseDto>(
        `${INSTAGRAM_API_URL}/${userId}/media`,
        new URLSearchParams({
          image_url: imageUrl,
          caption,
          access_token: accessToken,
        }),
        { timeout: REQUEST_TIMEOUT },
      );

      return { id: response.data.id };
    } catch (error: unknown) {
      this.handleInstagramError(error);
    }
  }

  async verificarStatus(containerId: string): Promise<InstagramMediaStatusDto> {
    const { accessToken } = this.getCredentials();

    try {
      const response = await axios.get<InstagramMediaStatusDto>(
        `${INSTAGRAM_API_URL}/${containerId}`,
        {
          params: { fields: 'id,status_code', access_token: accessToken },
          timeout: REQUEST_TIMEOUT,
        },
      );

      return { id: response.data.id, status_code: response.data.status_code };
    } catch (error: unknown) {
      this.handleInstagramError(error);
    }
  }

  async publicar(containerId: string): Promise<InstagramMediaResponseDto> {
    const { accessToken, userId } = this.getCredentials();

    try {
      const response = await axios.post<InstagramMediaResponseDto>(
        `${INSTAGRAM_API_URL}/${userId}/media_publish`,
        new URLSearchParams({
          creation_id: containerId,
          access_token: accessToken,
        }),
        { timeout: REQUEST_TIMEOUT },
      );

      return { id: response.data.id };
    } catch (error: unknown) {
      this.handleInstagramError(error);
    }
  }

  private getCredentials(): { accessToken: string; userId: string } {
    const accessToken = this.configService
      .get<string>('INSTAGRAM_ACCESS_TOKEN')
      ?.trim();
    const userId = this.configService.get<string>('INSTAGRAM_USER_ID')?.trim();

    if (!accessToken || !userId) {
      throw new ServiceUnavailableException(
        'Configure INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID no backend.',
      );
    }

    if (!/^\d+$/.test(userId)) {
      throw new ServiceUnavailableException(
        'Configure um INSTAGRAM_USER_ID válido no backend.',
      );
    }

    return { accessToken, userId };
  }

  private handleInstagramError(error: unknown): never {
    // O erro original do Axios contém a requisição com o token de acesso.
    if (isAxiosError<{ error?: { code?: number } }>(error)) {
      const status = error.response?.status;

      if (error.response?.data?.error?.code === 190 || status === 401) {
        throw new ServiceUnavailableException(
          'O token do Instagram está inválido ou expirado. Atualize-o no backend.',
        );
      }

      if (status === 403) {
        throw new ServiceUnavailableException(
          'Confira as permissões do token e da conta do Instagram no backend.',
        );
      }

      if (status === 429) {
        throw new ServiceUnavailableException(
          'O Instagram atingiu o limite de solicitações. Tente novamente mais tarde.',
        );
      }

      if (status && status >= 400 && status < 500) {
        throw new BadRequestException(
          'O Instagram recusou a solicitação. Confira a imagem, a legenda e o ID da mídia.',
        );
      }
    }

    throw new BadGatewayException(
      'Não foi possível confirmar a operação com o Instagram. Tente verificar novamente.',
    );
  }
}
