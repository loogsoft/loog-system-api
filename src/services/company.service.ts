import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { CompanyRequestDto } from '../dtos/request/company-request.dto';
import { CompanyResponseDto } from '../dtos/response/company-response.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async create(dto: CompanyRequestDto): Promise<CompanyResponseDto> {
    const entity = this.companyRepository.create(dto);
    const saved = await this.companyRepository.save(entity);
    return plainToInstance(CompanyResponseDto, saved);
  }

  async findAll(): Promise<CompanyResponseDto[]> {
    const list = await this.companyRepository.find();
    return list.map((item) => plainToInstance(CompanyResponseDto, item));
  }

  async findById(id: string): Promise<CompanyResponseDto> {
    const found = await this.companyRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Empresa não encontrada');
    return plainToInstance(CompanyResponseDto, found);
  }

  async update(
    id: string,
    dto: CompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    const entity = await this.companyRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Empresa não encontrada');
    Object.assign(entity, dto);
    const updated = await this.companyRepository.save(entity);
    return plainToInstance(CompanyResponseDto, updated);
  }
  async delete(id: string): Promise<void> {
    const entity = await this.companyRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Empresa não encontrada');
    await this.companyRepository.remove(entity);
  }
}
