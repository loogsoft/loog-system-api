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
} from '@nestjs/common';

import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { SupplierRequestDto } from 'src/dtos/request/supplier-request.dto';
import { SuppliersService } from 'src/services/supplier.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() dto: SupplierRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.create(dto, files);
  }
  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() dto: SupplierRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.update(id, dto, files);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
