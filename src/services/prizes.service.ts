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

  async create(data: PrizeRequestDto, companyId: string): Promise<Prize> {
    const prize = this.prizeRepository.create({ ...data, companyId });
    return this.prizeRepository.save(prize);
  }

  async findAll(companyId: string): Promise<Prize[]> {
    return this.prizeRepository.find({ where: { companyId } });
  }

  async findOne(id: number, companyId: string): Promise<Prize | null> {
    return this.prizeRepository.findOneBy({ id, companyId });
  }

  async update(
    id: number,
    data: Partial<PrizeRequestDto>,
    companyId: string,
  ): Promise<Prize | null> {
    await this.prizeRepository.update({ id, companyId }, data);
    return this.findOne(id, companyId);
  }

  async remove(id: number, companyId: string): Promise<void> {
    await this.prizeRepository.delete({ id, companyId });
  }
}
