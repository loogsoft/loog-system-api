import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { MessageRequestDto } from '../dtos/request/message-request.dto';
import { MessageResponseDto } from '../dtos/response/message-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Body() dto: MessageRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<MessageResponseDto> {
    return this.messagesService.create(dto, req.user.companyId);
  }

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<MessageResponseDto[]> {
    return this.messagesService.findAll(req.user.companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<MessageResponseDto> {
    return this.messagesService.findOne(id, req.user.companyId);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: MessageRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<MessageResponseDto> {
    return this.messagesService.update(id, dto, req.user.companyId);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<string> {
    return this.messagesService.remove(id, req.user.companyId);
  }
}
