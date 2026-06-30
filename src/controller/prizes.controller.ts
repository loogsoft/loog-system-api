import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PrizesService } from 'src/services/prizes.service';
import { PrizeRequestDto } from 'src/dtos/request/prize-request.dto';
import { Prize } from 'src/entities/prizes.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('prizes')
export class PrizesController {
  constructor(private readonly prizesService: PrizesService) {}

  @Post()
  async create(
    @Body() data: PrizeRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Prize> {
    console.log('Creating prize with data:', data);
    return this.prizesService.create(data, req.user.companyId);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest): Promise<Prize[]> {
    return this.prizesService.findAll(req.user.companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Prize | null> {
    return this.prizesService.findOne(Number(id), req.user.companyId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<PrizeRequestDto>,
    @Req() req: AuthenticatedRequest,
  ): Promise<Prize | null> {
    return this.prizesService.update(Number(id), data, req.user.companyId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.prizesService.remove(Number(id), req.user.companyId);
  }
}
