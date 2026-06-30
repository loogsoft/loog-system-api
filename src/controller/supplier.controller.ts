import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { SupplierRequestDto } from 'src/dtos/request/supplier-request.dto';
import { SuppliersService } from 'src/services/supplier.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() dto: SupplierRequestDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.create(dto, req.user.companyId, files);
  }
  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() dto: SupplierRequestDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.update(id, dto, req.user.companyId, files);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.service.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.service.findOne(id, req.user.companyId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.service.remove(id, req.user.companyId);
  }
}
