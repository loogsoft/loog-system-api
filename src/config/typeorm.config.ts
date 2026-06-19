import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),

  ssl:
    configService.get<string>('NODE_ENV') === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,

  autoLoadEntities: true,
  synchronize: true,
});
