import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prize } from 'src/entities/prizes.entity';
import { PrizeRequestDto } from 'src/dtos/request/prize-request.dto';
import { PrizeResponseDto } from 'src/dtos/response/prize-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdatePrizeRequestDto } from 'src/dtos/request/update-prize-request.dto';

const RESPONSE_OPTIONS = { excludeExtraneousValues: true };

@Injectable()
export class PrizesService {
  constructor(
    @InjectRepository(Prize)
    private readonly prizeRepository: Repository<Prize>,
  ) {}

  async create(
    data: PrizeRequestDto,
    companyId: string,
  ): Promise<PrizeResponseDto> {
    const prize = this.prizeRepository.create({ ...data, companyId });
    const saved = await this.prizeRepository.save(prize);
    return plainToInstance(PrizeResponseDto, saved, RESPONSE_OPTIONS);
  }

  async findAll(companyId: string): Promise<PrizeResponseDto[]> {
    const prizes = await this.prizeRepository.find({ where: { companyId } });
    return plainToInstance(PrizeResponseDto, prizes, RESPONSE_OPTIONS);
  }

  async findOne(id: string, companyId: string): Promise<PrizeResponseDto> {
    const prize = await this.prizeRepository.findOneBy({ id, companyId });
    if (!prize) {
      throw new NotFoundException('Prêmio não encontrado');
    }
    return plainToInstance(PrizeResponseDto, prize, RESPONSE_OPTIONS);
  }

  async update(
    id: string,
    data: UpdatePrizeRequestDto,
    companyId: string,
  ): Promise<PrizeResponseDto> {
    await this.prizeRepository.update({ id, companyId }, data);
    return this.findOne(id, companyId);
  }

  async remove(id: string, companyId: string): Promise<void> {
    await this.prizeRepository.delete({ id, companyId });
  }
}
