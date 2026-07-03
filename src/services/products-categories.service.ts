import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ProductsCategoriesRequestDto } from 'src/dtos/request/products-categories-request.dto';
import { UpdateProductsCategoriesRequestDto } from 'src/dtos/request/update-products-categories-request.dto';
import { ProductsCategoriesResponseDto } from 'src/dtos/response/products-categories-response.dto';
import { ProductsCategoriesEntity } from 'src/entities/products-categories.entity';
import { toLogString } from 'src/utils/logging';
import { Repository } from 'typeorm';

const RESPONSE_OPTIONS = { excludeExtraneousValues: true };

@Injectable()
export class ProductsCategoriesService {
  private readonly logger = new Logger(ProductsCategoriesService.name);

  constructor(
    @InjectRepository(ProductsCategoriesEntity)
    private readonly repo: Repository<ProductsCategoriesEntity>,
  ) {}

  async create(
    dto: ProductsCategoriesRequestDto,
    companyId: string,
  ): Promise<ProductsCategoriesResponseDto> {
    this.logger.log(`create:start ${toLogString({ companyId, dto })}`);

    const category = this.repo.create({ ...dto, companyId });
    const saved = await this.repo.save(category);

    this.logger.log(`create:success ${toLogString({ id: saved.id })}`);

    return plainToInstance(
      ProductsCategoriesResponseDto,
      saved,
      RESPONSE_OPTIONS,
    );
  }

  async findAll(companyId: string): Promise<ProductsCategoriesResponseDto[]> {
    this.logger.log(`findAll:start ${toLogString({ companyId })}`);

    const categories = await this.repo.find({
      where: { companyId },
      order: { name: 'ASC' },
    });

    this.logger.log(
      `findAll:success ${toLogString({ count: categories.length })}`,
    );

    return plainToInstance( 
      ProductsCategoriesResponseDto,
      categories,
      RESPONSE_OPTIONS,
    );
  }

  async findOne(
    id: string,
    companyId: string,
  ): Promise<ProductsCategoriesResponseDto> {
    this.logger.log(`findOne:start ${toLogString({ id, companyId })}`);

    const category = await this.repo.findOne({ where: { id, companyId } });

    if (!category) {
      throw new NotFoundException('Categoria de produto não encontrada');
    }

    this.logger.log(`findOne:success ${toLogString({ id })}`);

    return plainToInstance(
      ProductsCategoriesResponseDto,
      category,
      RESPONSE_OPTIONS,
    );
  }

  async update(
    id: string,
    dto: UpdateProductsCategoriesRequestDto,
    companyId: string,
  ): Promise<ProductsCategoriesResponseDto> {
    this.logger.log(`update:start ${toLogString({ id, companyId, dto })}`);

    const category = await this.repo.findOne({ where: { id, companyId } });

    if (!category) {
      throw new NotFoundException('Categoria de produto não encontrada');
    }

    Object.assign(category, dto);
    const updated = await this.repo.save(category);

    this.logger.log(`update:success ${toLogString({ id })}`);

    return plainToInstance(
      ProductsCategoriesResponseDto,
      updated,
      RESPONSE_OPTIONS,
    );
  }

  async remove(id: string, companyId: string): Promise<{ message: string }> {
    this.logger.log(`remove:start ${toLogString({ id, companyId })}`);

    const result = await this.repo.delete({ id, companyId });

    if (!result.affected) {
      throw new NotFoundException('Categoria de produto não encontrada');
    }

    this.logger.log(`remove:success ${toLogString({ id })}`);

    return { message: 'Categoria de produto removida com sucesso' };
  }
}
