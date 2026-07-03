import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductsCategoriesRequestDto } from 'src/dtos/request/products-categories-request.dto';
import { UpdateProductsCategoriesRequestDto } from 'src/dtos/request/update-products-categories-request.dto';
import { ProductsCategoriesResponseDto } from 'src/dtos/response/products-categories-response.dto';
import { ProductsCategoriesService } from 'src/services/products-categories.service';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('products-categories')
export class ProductsCategoriesController {
  constructor(private readonly service: ProductsCategoriesService) {}

  @Post()
  create(
    @Body() dto: ProductsCategoriesRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductsCategoriesResponseDto> {
    return this.service.create(dto, req.user.companyId);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductsCategoriesResponseDto[]> {
    return this.service.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductsCategoriesResponseDto> {
    return this.service.findOne(id, req.user.companyId);
  }
 
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductsCategoriesRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductsCategoriesResponseDto> {
    return this.service.update(id, dto, req.user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.service.remove(id, req.user.companyId);
  }
}
