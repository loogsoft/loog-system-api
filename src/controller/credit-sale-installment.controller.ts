import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreditSaleInstallmentRequestDto } from 'src/dtos/request/credit-sale-installment-request.dto';
import { CreditSaleInstallmentResponseDto } from 'src/dtos/response/credit-sale-installment-response.dto';
import { CreditSaleInstallmentService } from 'src/services/credit-sale-installment.service';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('credit-sale-installment')
export class CreditSaleInstallmentController {
  constructor(
    private readonly creditSaleInstallmentService: CreditSaleInstallmentService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreditSaleInstallmentRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditSaleInstallmentResponseDto> {
    return this.creditSaleInstallmentService.create(dto, req.user.companyId);
  }

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditSaleInstallmentResponseDto[]> {
    return this.creditSaleInstallmentService.findAll(req.user.companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditSaleInstallmentResponseDto> {
    return this.creditSaleInstallmentService.findOne(id, req.user.companyId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreditSaleInstallmentRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditSaleInstallmentResponseDto> {
    return this.creditSaleInstallmentService.update(
      id,
      dto,
      req.user.companyId,
    );
  }
}
