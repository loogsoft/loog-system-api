import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CompanyRequestDto } from '../dtos/request/company-request.dto';
import { CompanyResponseDto } from '../dtos/response/company-response.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() dto: CompanyRequestDto): Promise<CompanyResponseDto> {
    return await this.companyService.create(dto);
  }

  @Get()
  async findAll(): Promise<CompanyResponseDto[]> {
    return await this.companyService.findAll();
  }


  @Get(':id')
  async findById(@Param('id') id: string): Promise<CompanyResponseDto> {
    return await this.companyService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CompanyRequestDto): Promise<CompanyResponseDto> {
    return await this.companyService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.companyService.delete(id);
  }
}
