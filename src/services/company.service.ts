import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { CompanyRequestDto } from '../dtos/request/company-request.dto';
import { CompanyResponseDto } from '../dtos/response/company-response.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { addMonths } from 'date-fns';
import { SubscriptionStatusEnum } from 'src/dtos/enums/subscription-status.enum';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async create(dto: CompanyRequestDto): Promise<CompanyResponseDto> {
    const entity = this.companyRepository.create({
      ...dto,
      paymentDueDay: addMonths(new Date(), 1),
    });
    const saved = await this.companyRepository.save(entity);
    return plainToInstance(CompanyResponseDto, saved);
  }

  async findAll(): Promise<CompanyResponseDto[]> {
    const list = await this.companyRepository.find();

    return list.map((item) =>
      plainToInstance(CompanyResponseDto, {
        ...item,
        subscriptionStatus:
          item.paymentDueDay < new Date()
            ? SubscriptionStatusEnum.DISABLED
            : item.subscriptionStatus,
      }),
    );
  }

  async findById(id: string): Promise<CompanyResponseDto> {
    const found = await this.companyRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (found.paymentDueDay < new Date()) {
      found.subscriptionStatus = SubscriptionStatusEnum.DISABLED;
    }

    return plainToInstance(CompanyResponseDto, found);
  }

  async updateSubscription(
    id: string,
    status: SubscriptionStatusEnum,
  ): Promise<CompanyResponseDto> {
    const entity = await this.companyRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Empresa não encontrada');

    if (status === SubscriptionStatusEnum.ACTIVATED) {
      const baseDate =
        entity.paymentDueDay && entity.paymentDueDay > new Date()
          ? entity.paymentDueDay
          : new Date();
      entity.paymentDueDay = addMonths(baseDate, 1);
    }

    entity.subscriptionStatus = status;
    const updated = await this.companyRepository.save(entity);
    return plainToInstance(CompanyResponseDto, updated);
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
