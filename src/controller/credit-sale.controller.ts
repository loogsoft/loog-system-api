import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreditSaleRequestDto } from 'src/dtos/request/credit-sale-request.dto';
import { CreditSaleResponseDto } from 'src/dtos/response/credit-sale-response.dto';
import { CreditSaleService } from '../services/credit-sale.service';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('credit-sale')
export class CreditSaleController {
  constructor(private readonly creditSaleService: CreditSaleService) {}

  @Post()
  async create(
    @Body() dto: CreditSaleRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditSaleResponseDto> {
    return await this.creditSaleService.create(dto, req.user.companyId);
  }

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditSaleResponseDto[]> {
    return await this.creditSaleService.findAll(req.user.companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditSaleResponseDto> {
    return await this.creditSaleService.findOne(id, req.user.companyId);
  }
}
