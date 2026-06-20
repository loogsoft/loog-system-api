import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prize } from 'src/entities/prizes.entity';
import { PrizeRequestDto } from 'src/dtos/request/prize-request.dto';

@Injectable()
export class PrizesService {
  constructor(
    @InjectRepository(Prize)
    private readonly prizeRepository: Repository<Prize>,
  ) {}

  async create(data: PrizeRequestDto): Promise<Prize> {
    const prize = this.prizeRepository.create(data);
    return this.prizeRepository.save(prize);
  }

  async findAll(): Promise<Prize[]> {
    return this.prizeRepository.find();
  }

  async findOne(id: number): Promise<Prize | null> {
    return this.prizeRepository.findOneBy({ id });
  }

  async update(
    id: number,
    data: Partial<PrizeRequestDto>,
  ): Promise<Prize | null> {
    await this.prizeRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.prizeRepository.delete(id);
  }
}
