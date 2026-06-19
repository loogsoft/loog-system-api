import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRequestDto } from 'src/dtos/request/message-request.dto';
import { MessageResponseDto } from 'src/dtos/response/message-response.dto';
import { plainToInstance } from 'class-transformer';
import { toLogString } from 'src/utils/logging';
import { MessageEntity } from 'src/entities/messages.entity';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectRepository(MessageEntity)
    private repo: Repository<MessageEntity>,
  ) {}

  async create(dto: MessageRequestDto): Promise<MessageResponseDto> {
    this.logger.log(`create:start ${toLogString({ dto })}`);
    try {
      const exists = await this.repo.findOne({
        where: { productId: dto.productId },
      });
      if (exists) {
        return plainToInstance(MessageResponseDto, exists, {
          excludeExtraneousValues: true,
        });
      }
      const message = this.repo.create({
        name: dto.name,
        url: dto.url,
        description: dto.description,
        type: dto.type,
        productId: dto.productId,
      });
      const saved = await this.repo.save(message);
      const result = plainToInstance(MessageResponseDto, saved, {
        excludeExtraneousValues: true,
      });
      this.logger.log(
        `create:success ${toLogString({ productId: saved.productId })}`,
      );
      return result;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('create:error', errorStack);
      throw err;
    }
  }

  async findAll(): Promise<MessageResponseDto[]> {
    this.logger.log('findAll:start');
    try {
      const messages = await this.repo.find({ order: { date: 'DESC' } });
      const result = plainToInstance(MessageResponseDto, messages, {
        excludeExtraneousValues: true,
      });
      this.logger.log(
        `findAll:success ${toLogString({ count: messages.length })}`,
      );
      return result;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findAll:error', errorStack);
      throw err;
    }
  }

  async findOne(id: string): Promise<MessageResponseDto> {
    this.logger.log(`findOne:start ${toLogString({ productId: id })}`);
    try {
      const message = await this.repo.findOne({
        where: { id: Number(id) },
      });
      if (!message) {
        throw new NotFoundException('Mensagem não encontrada');
      }
      const result = plainToInstance(MessageResponseDto, message, {
        excludeExtraneousValues: true,
      });
      this.logger.log(`findOne:success ${toLogString({ productId: id })}`);
      return result;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findOne:error', errorStack);
      throw err;
    }
  }
  async update(
    id: string,
    dto: MessageRequestDto,
  ): Promise<MessageResponseDto> {
    this.logger.log(`update:start ${toLogString({ productId: id, dto })}`);
    try {
      const message = await this.repo.findOne({
        where: { id: Number(id) },
      });
      if (!message) {
        throw new NotFoundException('Mensagem não encontrada');
      }
      if (dto.name) message.name = dto.name;
      if (dto.url) message.url = dto.url;
      if (dto.description) message.description = dto.description;
      const updated = await this.repo.save(message);
      const result = plainToInstance(MessageResponseDto, updated, {
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
    this.logger.log(`remove:start ${toLogString({ productId: id })}`);
    try {
      const message = await this.repo.findOne({
        where: { id: Number(id) },
      });
      if (!message) {
        throw new NotFoundException('Mensagem não encontrada');
      }
      await this.repo.remove(message);
      this.logger.log(`remove:success ${toLogString({ productId: id })}`);
      return `Mensagem removida: ${message.name}`;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('remove:error', errorStack);
      throw err;
    }
  }
}
