import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StockMovementRequestDto } from 'src/dtos/request/stock-movement-request.dto';
import { StockMovementService } from 'src/services/stock-movement.service';
import { StockOperationService } from 'src/services/stock-operation.service';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('stock-movements')
export class StockMovementController {
  constructor(
    private readonly service: StockMovementService,
    private readonly operationService: StockOperationService,
  ) {}

  @Post()
  create(
    @Body() dto: StockMovementRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.operationService.create(dto, req.user.companyId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.service.findAll(req.user.companyId);
  }

  @Get('variation/:variationId')
  findByVariation(
    @Param('variationId') variationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.findByVariation(variationId, req.user.companyId);
  }
}
