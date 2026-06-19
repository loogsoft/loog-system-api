import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserRequestDto } from 'src/dtos/request/user-request.dto';
import { UserResponseDto } from 'src/dtos/response/user-response.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from 'src/dtos/request/login-request.dto';
import { LoginResponseDto } from 'src/dtos/response/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { toLogString } from 'src/utils/logging';
import { UpdatePasswordRequestDto } from 'src/dtos/request/update-password-request.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async create(dto: UserRequestDto): Promise<UserResponseDto> {
    this.logger.log(`create:start ${toLogString({ dto })}`);

    try {
      const userExists = await this.repo.findOne({
        where: { email: dto.email },
      });

      if (userExists) {
        throw new Error('Email já cadastrado');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);

      const userSave = this.repo.create({
        name: dto.name,
        email: dto.email,
        password: passwordHash,
        userType: dto.userType,
        companyId: dto.companyId,
      });

      const savedUser = await this.repo.save(userSave);

      const result = plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });

      this.logger.log(`create:success ${toLogString({ id: savedUser.id })}`);

      return result;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('create:error', errorStack);
      throw err;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('findAll:start');

    try {
      const users = await this.repo.find({ order: { dataCadastro: 'DESC' } });
      const result = plainToInstance(UserResponseDto, users);

      this.logger.log(
        `findAll:success ${toLogString({ count: users.length })}`,
      );

      return result;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findAll:error', errorStack);
      throw err;
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    this.logger.log(`findOne:start ${toLogString({ id })}`);

    try {
      const user = await this.repo.findOne({
        where: { id },
      });
      const result = plainToInstance(UserResponseDto, user);

      this.logger.log(`findOne:success ${toLogString({ id })}`);

      return result;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findOne:error', errorStack);
      throw err;
    }
  }

  async update(
    id: string,
    dto: Partial<UserRequestDto>,
  ): Promise<UserResponseDto> {
    this.logger.log(`update:start ${toLogString({ id, dto })}`);

    try {
      const user = await this.repo.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (dto.name) {
        user.name = dto.name;
      }

      if (dto.email) {
        user.email = dto.email;
      }

      if (dto.password) {
        user.password = await bcrypt.hash(dto.password, 10);
      }

      const updatedUser = await this.repo.save(user);
      const result = plainToInstance(UserResponseDto, updatedUser, {
        excludeExtraneousValues: true,
      });

      this.logger.log(`update:success ${toLogString({ id })}`);

      return result;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('update:error', errorStack);
      throw err;
    }
  }

  async remove(id: string): Promise<string> {
    this.logger.log(`remove:start ${toLogString({ id })}`);

    try {
      const user = await this.repo.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      await this.repo.remove(user);

      this.logger.log(`remove:success ${toLogString({ id })}`);

      return `Usuario ${user.name}`;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('remove:error', errorStack);
      throw err;
    }
  }

  async verifyEmail(dto: LoginRequestDto): Promise<{ companyId: string }> {
    this.logger.log(`verifyEmail:start ${toLogString({ email: dto.email })}`);

    try {
      const user = await this.repo.findOne({
        where: { email: dto.email.toLowerCase() },
      });

      if (!user) {
        throw new UnauthorizedException('Email ou senha inválidos');
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Email ou senha inválidos');
      }

      const code = this.generateCode();

      user.verificationCode = code;
      user.codeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.repo.save(user);

      this.emailService.sendVerificationCode(user.email, code);

      this.logger.log(
        `verifyEmail:success ${toLogString({ id: user.id, email: user.email })}`,
      );

      return { companyId: user.companyId };
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('verifyEmail:error', errorStack);
      throw err;
    }
  }

  async validateUser(email: string, code: string): Promise<LoginResponseDto> {
    this.logger.log(`validateUser:start ${toLogString({ email, code })}`);

    try {
      const user = await this.repo.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      if (!user.verificationCode) {
        throw new UnauthorizedException('Nenhum código gerado');
      }

      if (user.codeExpiresAt && user.codeExpiresAt < new Date()) {
        throw new UnauthorizedException('Código expirado');
      }

      if (user.verificationCode !== code) {
        throw new UnauthorizedException('Código inválido');
      }

      user.verificationCode = null;
      user.codeExpiresAt = null;

      await this.repo.save(user);

      const payload = { sub: user.id, email: user.email };

      const token = this.jwtService.sign(payload, {
        expiresIn: 5 * 60 * 60,
      });

      const result = {
        token,
        expiresIn: 5 * 60 * 60, // 5 horas em segundos
      };

      this.logger.log(
        `validateUser:success ${toLogString({ id: user.id, email: user.email })}`,
      );

      return result;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('validateUser:error', errorStack);
      throw err;
    }
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordRequestDto,
  ): Promise<UserResponseDto> {
    this.logger.log(`update:start ${toLogString({ id, dto })}`);

    try {
      const user = await this.repo.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (dto.defaultPassword && dto.newPassword) {
        const passwordMatch = await bcrypt.compare(dto.defaultPassword, user.password);

        if (!passwordMatch) {
          throw new UnauthorizedException('Senha atual incorreta');
        }

        user.password = await bcrypt.hash(dto.newPassword, 10);
      }
      
      const updatedUser = await this.repo.save(user);
      const result = plainToInstance(UserResponseDto, updatedUser, {
        excludeExtraneousValues: true,
      });

      this.logger.log(`update:success ${toLogString({ id })}`);

      return result;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('update:error', errorStack);
      throw err;
    }
  }
}
