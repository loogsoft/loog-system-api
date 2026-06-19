import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import { ProductEntity } from 'src/entities/product.entity';

import { SupplierEntity } from 'src/entities/supplier.entity';

import { ProductVariationEntity } from 'src/entities/product-variation.entity';

import { ProductRequestDto } from 'src/dtos/request/product-request.dto';

import { UpdateProductRequestDto } from 'src/dtos/request/update-product.dto';

import { ImageService } from 'src/services/image.service';

import { toLogString } from 'src/utils/logging';

import { StockMovementType } from 'src/entities/stock-movement.entity';
import { ProductStatusEnum } from 'src/dtos/enums/product-status.enum';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,

    @InjectRepository(SupplierEntity)
    private readonly supplierRepo: Repository<SupplierEntity>,

    @InjectRepository(ProductVariationEntity)
    private readonly variationRepo: Repository<ProductVariationEntity>,

    private readonly imageService: ImageService,
  ) {}

  async create(
    dto: ProductRequestDto,
    files?: Express.Multer.File[],
    variationFilesMap?: Map<number, Express.Multer.File>,
  ) {
    this.logger.log(`create:start ${toLogString({ dto })}`);

    try {
      let supplier: SupplierEntity | null = null;

      if (dto.supplierId) {
        supplier = await this.supplierRepo.findOne({
          where: { id: dto.supplierId },
        });

        if (!supplier) throw new NotFoundException('Fornecedor não encontrado');
      }

      const { variations, supplierId, ...dtoWithoutVariations } = dto;

      const images = await this.imageService.createImages(files ?? []);

      let variationEntities: ProductVariationEntity[] = [];
      if (variations && variations.length > 0) {
        variationEntities = await Promise.all(
          variations.map(async (v, index) => {
            let imageUrl = v.imageUrl;
            const variationFile = variationFilesMap?.get(index);
            if (variationFile) {
              const result: any =
                await this.imageService.uploadToCloudinary(variationFile);
              imageUrl = result.secure_url;
            }
            return Object.assign(new ProductVariationEntity(), {
              name: `${v.color} ${v.size}`,
              price: v.price?.toString(),
              stock: v.stock,
              color: v.color,
              size: v.size,
              imageUrl,
              isActive: v.isActive ?? true,
              activeLowStock: v.activeLowStock,
            });
          }),
        );
      }

      const product = this.repo.create({
        ...dtoWithoutVariations,
        price: dto.price,
        promoPrice: dto.promoPrice,
        supplier: supplier ?? undefined,
        images: images,
        variations: variationEntities,
        color: dto.color ?? undefined,
        size: dto.size ?? undefined,
      });

      const savedProduct = await this.repo.save(product);

      this.logger.log(
        `create:success ${toLogString({
          id: savedProduct.id,
        })}`,
      );

      return await this.findOne(savedProduct.id);
    } catch (err) {
      this.logger.error(err);

      throw err;
    }
  }

  async findAll() {
    return await this.repo.find({
      relations: {
        images: true,
        supplier: true,
        variations: true,
      },

      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.repo.findOne({
      where: { id },

      relations: {
        images: true,
        supplier: true,
        variations: true,
      },
    });

    if (!product) throw new NotFoundException('Produto não encontrado');

    return product;
  }

  async update(
    id: string,
    dto: UpdateProductRequestDto,
    files?: Express.Multer.File[],
    variationFilesMap?: Map<number, Express.Multer.File>,
  ) {
    const product = await this.findOne(id);

    if (dto.imageIds !== undefined) {
      const currentImageIds = product.images.map((img) => img.id);
      const imageIdsToKeep = dto.imageIds || [];
      const imageIdsToDelete = currentImageIds.filter(
        (imgId) => !imageIdsToKeep.includes(imgId),
      );

      if (imageIdsToDelete.length > 0) {
        await this.imageService.deleteImages(imageIdsToDelete);
        product.images = product.images.filter(
          (img) => !imageIdsToDelete.includes(img.id),
        );
      }
    }

    if (files && files.length > 0) {
      const newImages = await this.imageService.createImages(files);
      product.images = [...product.images, ...newImages];
    }

    const { imageIds, variations: variationDtos, ...updateData } = dto;

    Object.assign(product, {
      ...updateData,
      price: dto.price?.toString(),
      promoPrice: dto.promoPrice?.toString(),
      color: dto.color ?? undefined,
      size: dto.size ?? undefined,
    });

    if (variationDtos !== undefined) {
      const existingVariations = product.variations ?? [];

      const newKeys = new Set(variationDtos.map((v) => `${v.color}|${v.size}`));
      const variationsToDelete = existingVariations.filter(
        (v) => !newKeys.has(`${v.color}|${v.size}`),
      );

      if (variationsToDelete.length > 0) {
        for (const variation of variationsToDelete) {
          const movementCount = await this.variationRepo.manager
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('stock_movements', 'sm')
            .where('sm."variationId" = :id', { id: variation.id })
            .getRawOne();

          if (Number(movementCount?.count) > 0) {
            await this.variationRepo.update(variation.id, { isActive: false });
          } else {
            await this.variationRepo.remove(variation);
          }
        }
      }

      const variationEntities = await Promise.all(
        variationDtos.map(async (v, index) => {
          const existing = existingVariations.find(
            (e) => e.color === v.color && e.size === v.size,
          );
          let imageUrl = v.imageUrl;
          const variationFile = variationFilesMap?.get(index);
          if (variationFile) {
            const result: any =
              await this.imageService.uploadToCloudinary(variationFile);
            imageUrl = result.secure_url;
          }
          return Object.assign(new ProductVariationEntity(), {
            ...(existing && { id: existing.id }),
            name: `${v.color} ${v.size}`,
            price: v.price?.toString(),
            stock: v.stock,
            color: v.color,
            size: v.size,
            imageUrl: imageUrl ?? existing?.imageUrl,
            isActive: v.isActive ?? true,
            activeLowStock: v.activeLowStock,
          });
        }),
      );
      product.variations = variationEntities;
    }

    return await this.repo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.repo.remove(product);

    return {
      message: 'Produto deletado com sucesso',
    };
  }

  async updateStock(id: string, quantity: number, type: StockMovementType) {
    this.logger.log(`updateStock:start ${toLogString({ id, quantity, type })}`);

    try {
      const product = await this.findOne(id);
      if (typeof product.stock === 'number') {
        if (type === StockMovementType.IN) {
          product.stock += quantity;
        } else {
          product.stock -= quantity;
          if (product.stock <= 0) {
            product.status = ProductStatusEnum.DISABLED;
          }
        }
        await this.repo.save(product);
        this.logger.log(
          `updateStock:success ${toLogString({ id, stock: product.stock })}`,
        );
      } else {
        throw new Error('Estoque do produto não está definido');
      }
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('updateStock:error', errorStack);
      throw err;
    }
  }
}
