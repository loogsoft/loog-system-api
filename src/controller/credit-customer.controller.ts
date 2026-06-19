import { Controller, Body, Post, Get, Param, Put } from '@nestjs/common';
import { CreditCustomerRequestDto } from 'src/dtos/request/credit-customer-request.dto';
import { CreditCustomerResponseDto } from 'src/dtos/response/credit-customer-response.dto';
import { CreditCustomerService } from 'src/services/credit-customer.service';

@Controller('credit-customer')
export class CreditCustomerController {
  constructor(private readonly creditCustomerService: CreditCustomerService) {}

  @Post()
  async create(
    @Body() dto: CreditCustomerRequestDto,
  ): Promise<CreditCustomerResponseDto> {
    return this.creditCustomerService.create(dto);
  }

  @Get()
  async findAll(): Promise<CreditCustomerResponseDto[]> {
    return this.creditCustomerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreditCustomerResponseDto> {
    return this.creditCustomerService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreditCustomerRequestDto,
  ): Promise<CreditCustomerResponseDto> {
    return this.creditCustomerService.update(id, dto);
  }
}
