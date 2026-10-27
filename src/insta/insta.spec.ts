import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import type { Server } from 'http';
import request from 'supertest';
import { JwtStrategy } from '../auth/ jwt.strategy';
import { InstaModule } from './insta.module';

const TEST_ACCESS_TOKEN = 'instagram-test-secret';
const TEST_USER_ID = '123456789';

describe('Integração do Instagram', () => {
  let app: INestApplication;
  let server: Server;
  let config: ConfigService;
  let authorization: string;
  const get = jest.spyOn(axios, 'get');
  const post = jest.spyOn(axios, 'post');

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          load: [
            () => ({
              INSTAGRAM_ACCESS_TOKEN: TEST_ACCESS_TOKEN,
              INSTAGRAM_USER_ID: TEST_USER_ID,
            }),
          ],
        }),
        PassportModule,
        InstaModule,
      ],
      providers: [JwtStrategy],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        validationError: { target: false, value: false },
      }),
    );
    await app.init();
    server = app.getHttpServer() as Server;
    config = app.get(ConfigService);

    const jwt = new JwtService({
      secret: process.env.JWT_SECRET || 'jwt_secret_dev',
    });
    authorization = `Bearer ${jwt.sign({
      sub: 'test-user',
      email: 'test@example.com',
      companyId: 'test-company',
    })}`;
  });

  beforeEach(() => {
    jest.resetAllMocks();
    config.set('INSTAGRAM_ACCESS_TOKEN', TEST_ACCESS_TOKEN);
    config.set('INSTAGRAM_USER_ID', TEST_USER_ID);
  });

  afterAll(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  it.each(['/insta/account', '/insta/media/123/status'])(
    'exige autenticação para GET %s',
    async (path) => {
      await request(server).get(path).expect(401);
      expect(get).not.toHaveBeenCalled();
    },
  );

  it.each(['/insta/media', '/insta/publish'])(
    'exige autenticação para POST %s',
    async (path) => {
      await request(server).post(path).send({}).expect(401);
      expect(post).not.toHaveBeenCalled();
    },
  );

  it('consulta a conta com o token do servidor e retorna apenas os campos públicos', async () => {
    get.mockResolvedValue({
      data: {
        id: TEST_USER_ID,
        username: 'test_account',
        name: 'Conta de teste',
        account_type: 'BUSINESS',
        access_token: TEST_ACCESS_TOKEN,
      },
    });

    const response = await request(server)
      .get('/insta/account')
      .set('Authorization', authorization)
      .expect(200);

    expect(response.body).toEqual({
      id: TEST_USER_ID,
      username: 'test_account',
      name: 'Conta de teste',
      account_type: 'BUSINESS',
    });
    expect(get).toHaveBeenCalledWith(
      `https://graph.instagram.com/v24.0/${TEST_USER_ID}`,
      expect.objectContaining({
        params: {
          fields: 'id,username,name,account_type',
          access_token: TEST_ACCESS_TOKEN,
        },
      }),
    );
    expect(response.text).not.toContain(TEST_ACCESS_TOKEN);
  });

  it('cria a mídia com imagem e legenda validadas e credenciais do servidor', async () => {
    post.mockResolvedValue({ data: { id: '987654321' } });

    await request(server)
      .post('/insta/media')
      .set('Authorization', authorization)
      .send({
        imageUrl: ' https://example.com/image.jpg ',
        caption: ' Legenda ',
      })
      .expect(201, { id: '987654321' });

    expect(post).toHaveBeenCalledWith(
      `https://graph.instagram.com/v24.0/${TEST_USER_ID}/media`,
      new URLSearchParams({
        image_url: 'https://example.com/image.jpg',
        caption: 'Legenda',
        access_token: TEST_ACCESS_TOKEN,
      }),
      expect.objectContaining({ timeout: 30_000 }),
    );
  });

  it.each([
    { imageUrl: 'http://example.com/image.jpg', caption: 'Legenda' },
    { imageUrl: 'https://example.com/image.jpg', caption: '   ' },
    { imageUrl: 'https://example.com/image.jpg', caption: 'a'.repeat(2201) },
    {
      imageUrl: 'https://example.com/image.jpg',
      caption: 'Legenda',
      access_token: 'token-do-cliente',
    },
  ])(
    'rejeita dados inválidos ou credenciais enviadas pelo cliente: %j',
    async (body) => {
      await request(server)
        .post('/insta/media')
        .set('Authorization', authorization)
        .send(body)
        .expect(400);

      expect(post).not.toHaveBeenCalled();
    },
  );

  it('consulta o status da mídia pelo backend', async () => {
    get.mockResolvedValue({
      data: { id: '987654321', status_code: 'FINISHED' },
    });

    await request(server)
      .get('/insta/media/987654321/status')
      .set('Authorization', authorization)
      .expect(200, { id: '987654321', status_code: 'FINISHED' });

    expect(get).toHaveBeenCalledWith(
      'https://graph.instagram.com/v24.0/987654321',
      expect.objectContaining({
        params: { fields: 'id,status_code', access_token: TEST_ACCESS_TOKEN },
      }),
    );
  });

  it('publica usando o ID do container e as credenciais do servidor', async () => {
    post.mockResolvedValue({ data: { id: '111222333' } });

    await request(server)
      .post('/insta/publish')
      .set('Authorization', authorization)
      .send({ containerId: '987654321' })
      .expect(201, { id: '111222333' });

    expect(post).toHaveBeenCalledWith(
      `https://graph.instagram.com/v24.0/${TEST_USER_ID}/media_publish`,
      new URLSearchParams({
        creation_id: '987654321',
        access_token: TEST_ACCESS_TOKEN,
      }),
      expect.objectContaining({ timeout: 30_000 }),
    );
  });

  it('rejeita IDs inválidos tanto na consulta quanto na publicação', async () => {
    await request(server)
      .get('/insta/media/me/status')
      .set('Authorization', authorization)
      .expect(400);
    await request(server)
      .post('/insta/publish')
      .set('Authorization', authorization)
      .send({ containerId: '../me' })
      .expect(400);

    expect(get).not.toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });

  it('informa ausência de configuração sem chamar o Instagram', async () => {
    config.set('INSTAGRAM_ACCESS_TOKEN', '');

    await request(server)
      .get('/insta/account')
      .set('Authorization', authorization)
      .expect(503);

    expect(get).not.toHaveBeenCalled();
  });

  it.each([
    { code: 190, status: 400, expectedStatus: 503 },
    { code: 10, status: 403, expectedStatus: 503 },
    { code: 4, status: 429, expectedStatus: 503 },
    { code: 100, status: 400, expectedStatus: 400 },
    { code: 2, status: 500, expectedStatus: 502 },
  ])(
    'trata o erro $code do Instagram sem expor o token',
    async ({ code, status, expectedStatus }) => {
      const error = new AxiosError(`Falha com ${TEST_ACCESS_TOKEN}`);
      error.response = {
        status,
        statusText: 'Erro de teste',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { error: { code, message: TEST_ACCESS_TOKEN } },
      };
      get.mockRejectedValue(error);

      const response = await request(server)
        .get('/insta/account')
        .set('Authorization', authorization)
        .expect(expectedStatus);

      expect(response.text).not.toContain(TEST_ACCESS_TOKEN);
      expect(response.body).toHaveProperty('message');
    },
  );

  it('trata falhas de rede sem expor detalhes da requisição', async () => {
    get.mockRejectedValue(new AxiosError(`Timeout com ${TEST_ACCESS_TOKEN}`));

    const response = await request(server)
      .get('/insta/account')
      .set('Authorization', authorization)
      .expect(502);

    expect(response.text).not.toContain(TEST_ACCESS_TOKEN);
  });
});
