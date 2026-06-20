import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // ✅ Ativa validação global para todos os DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não existem no DTO
      forbidNonWhitelisted: true, // lança erro se enviar campo extra
      transform: true, // converte tipos automaticamente
    }),
  );

  // ✅ Pasta pública para uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Failed to start application', error);
  process.exit(1);
});
