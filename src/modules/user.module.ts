import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/controller/user.controller';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';
import { JwtStrategy } from 'src/auth/ jwt.strategy';
import { EmailModule } from './email.module';
import { CompanyModule } from './company.module';
import { CompanyEntity } from 'src/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CompanyEntity]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt_secret_dev',
      signOptions: { expiresIn: 5 * 60 * 60 }, // 5 horas em segundos
    }),
    EmailModule,
    CompanyModule,
  ],
  controllers: [UsersController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
