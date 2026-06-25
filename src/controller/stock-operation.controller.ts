import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StockMovementRequestDto } from 'src/dtos/request/stock-movement-request.dto';
import { StockOperationService } from 'src/services/stock-operation.service';

@Controller('stock-operations')
export class StockOperationController {
  constructor(private readonly service: StockOperationService) {}

  @Post()
  create(@Body() dto: StockMovementRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
