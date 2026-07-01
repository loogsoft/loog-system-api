import {
  BadRequestException,
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Put,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CompanyRequestDto } from '../dtos/request/company-request.dto';
import { CompanyResponseDto } from '../dtos/response/company-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCompanyRequestDto } from 'src/dtos/request/update-company-request.dto';
import { UpdateSubscriptionRequestDto } from 'src/dtos/request/update-subscription-request.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() dto: CompanyRequestDto): Promise<CompanyResponseDto> {
    return await this.companyService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<CompanyResponseDto[]> {
    return await this.companyService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CompanyResponseDto> {
    return await this.companyService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('subscription/:id')
  async updateInscription(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateSubscriptionRequestDto,
  ): Promise<CompanyResponseDto> {
    const status = body.status;

    if (!status) {
      throw new BadRequestException('Status da assinatura não informado');
    }

    return await this.companyService.updateSubscription(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    return await this.companyService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.companyService.delete(id);
  }
}
