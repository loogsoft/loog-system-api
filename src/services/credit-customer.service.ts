import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreditCustomerEntity } from '../entities/credit-customer.entity';
import { CreditCustomerRequestDto } from 'src/dtos/request/credit-customer-request.dto';
import { CreditCustomerResponseDto } from 'src/dtos/response/credit-customer-response.dto';
import { plainToInstance } from 'class-transformer';

type DatabaseError = {
  code?: string;
  constraint?: string;
  detail?: string;
  driverError?: {
    code?: string;
    constraint?: string;
    detail?: string;
  };
};

@Injectable()
export class CreditCustomerService {
  constructor(
    @InjectRepository(CreditCustomerEntity)
    private readonly repo: Repository<CreditCustomerEntity>,
  ) {}

  async create(
    dto: CreditCustomerRequestDto,
    companyId: string,
  ): Promise<CreditCustomerResponseDto> {
    await this.validateUniqueCustomer(dto, companyId);

    const entity = this.repo.create({ ...dto, companyId });
    const saved = await this.saveOrThrowConflict(entity);
    return plainToInstance(CreditCustomerResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(
    id: string,
    companyId: string,
  ): Promise<CreditCustomerResponseDto> {
    const entity = await this.repo.findOne({ where: { id, companyId } });

    if (!entity) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return plainToInstance(CreditCustomerResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    dto: CreditCustomerRequestDto,
    companyId: string,
  ): Promise<CreditCustomerResponseDto> {
    const entity = await this.repo.findOne({ where: { id, companyId } });

    if (!entity) {
      throw new NotFoundException('Cliente não encontrado');
    }

    await this.validateUniqueCustomer(dto, companyId, id);

    Object.assign(entity, dto);
    const updated = await this.saveOrThrowConflict(entity);

    return plainToInstance(CreditCustomerResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string): Promise<CreditCustomerResponseDto[]> {
    const list = await this.repo.find({
      where: { companyId },
      order: { date: 'DESC' },
    });
    return plainToInstance(CreditCustomerResponseDto, list, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string, companyId: string): Promise<string> {
    const entity = await this.repo.findOne({ where: { id, companyId } });

    if (!entity) {
      throw new NotFoundException('Cliente não encontrado');
    }

    await this.repo.delete(entity.id);

    return 'Cliente deletado com sucesso';
  }

  private async validateUniqueCustomer(
    dto: CreditCustomerRequestDto,
    companyId: string,
    ignoredId?: string,
  ): Promise<void> {
    const ignoreCurrent = ignoredId ? { id: Not(ignoredId) } : {};
    const existing = await this.repo.find({
      where: [
        { companyId, customerEmail: dto.customerEmail, ...ignoreCurrent },
        { companyId, CPF: dto.CPF, ...ignoreCurrent },
      ],
    });

    if (
      existing.some((customer) => customer.customerEmail === dto.customerEmail)
    ) {
      throw new ConflictException('Já existe um cliente com este e-mail.');
    }

    if (existing.some((customer) => customer.CPF === dto.CPF)) {
      throw new ConflictException('Já existe um cliente com este CPF.');
    }
  }

  private async saveOrThrowConflict(
    entity: CreditCustomerEntity,
  ): Promise<CreditCustomerEntity> {
    try {
      return await this.repo.save(entity);
    } catch (error) {
      this.throwConflictForUniqueViolation(error);
    }
  }

  private throwConflictForUniqueViolation(error: unknown): never {
    const databaseError = error as DatabaseError;
    const code = databaseError.code ?? databaseError.driverError?.code;

    if (code !== '23505') {
      throw error;
    }

    const reason = [
      databaseError.constraint,
      databaseError.detail,
      databaseError.driverError?.constraint,
      databaseError.driverError?.detail,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (reason.includes('cpf')) {
      throw new ConflictException('Já existe um cliente com este CPF.');
    }

    if (reason.includes('email')) {
      throw new ConflictException('Já existe um cliente com este e-mail.');
    }

    throw new ConflictException('Já existe um cliente com este e-mail ou CPF.');
  }
}
