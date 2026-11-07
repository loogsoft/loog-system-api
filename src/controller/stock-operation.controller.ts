import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StockMovementRequestDto } from 'src/dtos/request/stock-movement-request.dto';
import { StockOperationQueryDto } from 'src/dtos/request/stock-operation-query.dto';
import { StockOperationService } from 'src/services/stock-operation.service';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('stock-operations')
export class StockOperationController {
  constructor(private readonly service: StockOperationService) {}

  @Post()
  create(
    @Body() dto: StockMovementRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.create(dto, req.user.companyId);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: StockOperationQueryDto,
  ) {
    return this.service.findAll(req.user.companyId, query);
  }

  @Get('best-selling-products')
  getBestSellingProducts(@Req() req: AuthenticatedRequest) {
    return this.service.getBestSellingProducts(req.user.companyId);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.findOne(id, req.user.companyId);
  }
}
