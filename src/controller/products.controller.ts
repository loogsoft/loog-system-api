import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { plainToInstance } from 'class-transformer';

import { ProductRequestDto } from 'src/dtos/request/product-request.dto';

import { UpdateProductRequestDto } from 'src/dtos/request/update-product.dto';

import { ProductResponseDto } from 'src/dtos/response/product-response.dto';

import { ProductsService } from 'src/services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  private buildVariationFilesMap(
    files: Express.Multer.File[],
  ): Map<number, Express.Multer.File> {
    const map = new Map<number, Express.Multer.File>();
    files?.forEach((f) => {
      const match = f.fieldname.match(/^variationImage_(\d+)$/);
      if (match) map.set(Number(match[1]), f);
    });
    return map;
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() dto: ProductRequestDto,

    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const productFiles = files?.filter((f) => f.fieldname === 'files') ?? [];
    const variationFilesMap = this.buildVariationFilesMap(files ?? []);

    const product = await this.productsService.create(
      dto,
      productFiles,
      variationFilesMap,
    );

    return plainToInstance(ProductResponseDto, product);
  }

  @Get()
  async findAll() {
    const products = await this.productsService.findAll();
    return plainToInstance(ProductResponseDto, products);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);

    return plainToInstance(ProductResponseDto, product);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const productFiles = files?.filter((f) => f.fieldname === 'files') ?? [];
    const variationFilesMap = this.buildVariationFilesMap(files ?? []);
    const product = await this.productsService.update(
      id,
      dto,
      productFiles,
      variationFilesMap,
    );
    return plainToInstance(ProductResponseDto, product);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
