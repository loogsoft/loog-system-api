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
  ParseUUIDPipe,
} from '@nestjs/common';
import { PrizesService } from 'src/services/prizes.service';
import { PrizeRequestDto } from 'src/dtos/request/prize-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';
import { PrizeResponseDto } from 'src/dtos/response/prize-response.dto';
import { UpdatePrizeRequestDto } from 'src/dtos/request/update-prize-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('prizes')
export class PrizesController {
  constructor(private readonly prizesService: PrizesService) {}

  @Post()
  async create(
    @Body() data: PrizeRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PrizeResponseDto> {
    console.log('Creating prize with data:', data);
    return this.prizesService.create(data, req.user.companyId);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest): Promise<PrizeResponseDto[]> {
    return this.prizesService.findAll(req.user.companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<PrizeResponseDto> {
    return this.prizesService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdatePrizeRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PrizeResponseDto> {
    return this.prizesService.update(id, data, req.user.companyId);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.prizesService.remove(id, req.user.companyId);
  }
}
