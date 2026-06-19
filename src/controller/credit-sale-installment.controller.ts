import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreditSaleInstallmentRequestDto } from 'src/dtos/request/credit-sale-installment-request.dto';
import { CreditSaleInstallmentResponseDto } from 'src/dtos/response/credit-sale-installment-response.dto';
import { CreditSaleInstallmentService } from 'src/services/credit-sale-installment.service';

@Controller('credit-sale-installment')
export class CreditSaleInstallmentController {
  constructor(
    private readonly creditSaleInstallmentService: CreditSaleInstallmentService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreditSaleInstallmentRequestDto,
  ): Promise<CreditSaleInstallmentResponseDto> {
    return this.creditSaleInstallmentService.create(dto);
  }

  @Get()
  async findAll(): Promise<CreditSaleInstallmentResponseDto[]> {
    return this.creditSaleInstallmentService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<CreditSaleInstallmentResponseDto> {
    return this.creditSaleInstallmentService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreditSaleInstallmentRequestDto,
  ): Promise<CreditSaleInstallmentResponseDto> {
    return this.creditSaleInstallmentService.update(id, dto);
  }
}
