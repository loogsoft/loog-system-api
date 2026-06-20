import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PrizesService } from 'src/services/prizes.service';
import { PrizeRequestDto } from 'src/dtos/request/prize-request.dto';
import { Prize } from 'src/entities/prizes.entity';

@Controller('prizes')
export class PrizesController {
  constructor(private readonly prizesService: PrizesService) {}

  @Post()
  async create(@Body() data: PrizeRequestDto): Promise<Prize> {
    console.log('Creating prize with data:', data);
    return this.prizesService.create(data);
  }

  @Get()
  async findAll(): Promise<Prize[]> {
    return this.prizesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Prize | null> {
    return this.prizesService.findOne(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<PrizeRequestDto>,
  ): Promise<Prize | null> {
    return this.prizesService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.prizesService.remove(Number(id));
  }
}
