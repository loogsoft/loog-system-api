import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreditCustomerRequestDto } from 'src/dtos/request/credit-customer-request.dto';
import { CreditCustomerResponseDto } from 'src/dtos/response/credit-customer-response.dto';
import { CreditCustomerService } from 'src/services/credit-customer.service';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('credit-customer')
export class CreditCustomerController {
  constructor(private readonly creditCustomerService: CreditCustomerService) {}

  @Post()
  async create(
    @Body() dto: CreditCustomerRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditCustomerResponseDto> {
    return this.creditCustomerService.create(dto, req.user.companyId);
  }

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditCustomerResponseDto[]> {
    return this.creditCustomerService.findAll(req.user.companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditCustomerResponseDto> {
    return this.creditCustomerService.findOne(id, req.user.companyId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreditCustomerRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreditCustomerResponseDto> {
    return this.creditCustomerService.update(id, dto, req.user.companyId);
  }
}
