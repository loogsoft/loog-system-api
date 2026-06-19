import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierRequestDto } from 'src/dtos/request/supplier-request.dto';
import { SupplierEntity } from 'src/entities/supplier.entity';
import { Repository } from 'typeorm';
import { toLogString } from 'src/utils/logging';
import { ImageService } from 'src/services/image.service';

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger(SuppliersService.name);

  constructor(
    @InjectRepository(SupplierEntity)
    private readonly repo: Repository<SupplierEntity>,
    private readonly imageService: ImageService,
  ) {}

  async create(dto: SupplierRequestDto, files?: Express.Multer.File[]) {
    this.logger.log(`create:start ${toLogString({ dto })}`);
    try {
      let images: import('src/entities/image.entity').ImageEntity[] = [];
      if (files && files.length > 0) {
        images = await this.imageService.createImages(files);
      }
      const supplier = this.repo.create({ ...dto, images });
      const savedSupplier = await this.repo.save(supplier);
      this.logger.log(
        `create:success ${toLogString({ id: savedSupplier.id })}`,
      );
      return savedSupplier;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('create:error', errorStack);
      throw err;
    }
  }

  async update(
    id: string,
    dto: SupplierRequestDto,
    files?: Express.Multer.File[],
  ) {
    this.logger.log(`update:start ${toLogString({ id, dto })}`);
    try {
      const supplier = await this.repo.findOne({
        where: { id },
        relations: ['images'],
      });
      if (!supplier) {
        throw new NotFoundException('Fornecedor não encontrado');
      }
      let images: import('src/entities/image.entity').ImageEntity[] =
        supplier.images || [];
      if (files && files.length > 0) {
        const newImages = await this.imageService.createImages(files);
        images = [...images, ...newImages];
      }
      Object.assign(supplier, { ...dto, images });
      const updated = await this.repo.save(supplier);
      this.logger.log(`update:success ${toLogString({ id })}`);
      return updated;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('update:error', errorStack);
      throw err;
    }
  }

  async findAll() {
    this.logger.log('findAll:start');

    try {
      const suppliers = await this.repo.find({
        relations: ['images'],
        order: { createdAt: 'DESC' },
      });

      this.logger.log(
        `findAll:success ${toLogString({ count: suppliers.length })}`,
      );

      return suppliers;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findAll:error', errorStack);
      throw err;
    }
  }

  async findOne(id: string) {
    this.logger.log(`findOne:start ${toLogString({ id })}`);

    try {
      const supplier = await this.repo.findOne({
        where: { id },
        relations: ['images'],
      });

      this.logger.log(`findOne:success ${toLogString({ id })}`);

      return supplier;
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findOne:error', errorStack);
      throw err;
    }
  }
  async remove(id: string) {
    this.logger.log(`remove:start ${toLogString({ id })}`);

    try {
      const result = await this.repo.delete(id);

      if (!result.affected) {
        throw new NotFoundException('Produto não encontrado');
      }

      this.logger.log(`remove:success ${toLogString({ id })}`);

      return { message: 'Produto removido com sucesso' };
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('remove:error', errorStack);
      throw err;
    }
  }
}
