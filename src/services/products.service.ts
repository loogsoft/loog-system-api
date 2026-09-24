import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ProductStatusEnum } from 'src/dtos/enums/product-status.enum';
import { ProductRequestDto } from 'src/dtos/request/product-request.dto';
import { UpdateProductRequestDto } from 'src/dtos/request/update-product.dto';
import { ProductResponseDto } from 'src/dtos/response/product-response.dto';
import { ProductVariationEntity } from 'src/entities/product-variation.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { StockMovementType } from 'src/entities/stock-movement-type.enum';
import { SupplierEntity } from 'src/entities/supplier.entity';
import { ImageService } from 'src/services/image.service';
import { toLogString } from 'src/utils/logging';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

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

  private getTotalStock(product: ProductEntity): number {
    const activeVariations = (product.variations ?? []).filter(
      (variation) => variation.isActive !== false,
    );

    if (activeVariations.length > 0) {
      return activeVariations.reduce(
        (total, variation) => total + Number(variation.stock ?? 0),
        0,
      );
    }

    return Number(product.stock ?? 0);
  }

  private disableIfOutOfStock(product: ProductEntity): void {
    if (this.getTotalStock(product) <= 0) {
      product.status = ProductStatusEnum.DISABLED;
    }
  }

  async create(
    dto: ProductRequestDto,
    companyId: string,
    files?: Express.Multer.File[],
    variationFilesMap?: Map<number, Express.Multer.File>,
  ) {
    this.logger.log(`create:start ${toLogString({ dto })}`);

    try {
      let supplier: SupplierEntity | null = null;

      if (dto.supplierId) {
        supplier = await this.supplierRepo.findOne({
          where: { id: dto.supplierId, companyId },
        });

        if (!supplier) throw new NotFoundException('Fornecedor não encontrado');
      }

      const {
        variations,
        supplierId: _supplierId,
        category,
        ...productData
      } = dto;
      void _supplierId;

      const hasVariations = Boolean(variations?.length);
      const images = hasVariations
        ? []
        : await this.imageService.createImages(files ?? [], companyId);

      let variationEntities: ProductVariationEntity[] = [];
      if (variations && variations.length > 0) {
        variationEntities = await Promise.all(
          variations.map(async (v, index) => {
            let imageUrl = v.imageUrl;
            const variationFile = variationFilesMap?.get(index);
            if (variationFile) {
              const result =
                await this.imageService.uploadToCloudinary(variationFile);
              imageUrl = result.secure_url;
            }
            return Object.assign(new ProductVariationEntity(), {
              name: `${v.color} ${v.size}`,
              companyId: companyId,
              barCode: v.barCode,
              price: v.price?.toString(),
              stock: v.stock,
              color: v.color,
              size: v.size,
              imageUrl,
              isActive: v.isActive ?? true,
              activeLowStock: v.activeLowStock,
              lowStock: v.activeLowStock ? Math.max(1, v.lowStock ?? 5) : 0,
            });
          }),
        );
      }

      const product = this.repo.create({
        ...productData,
        category,
        price: variationEntities.length > 0 ? null : dto.price,
        companyId: companyId,
        promoPrice: variationEntities.length > 0 ? null : dto.promoPrice,
        stock: variationEntities.length > 0 ? null : dto.stock,
        activeLowStock:
          variationEntities.length > 0 ? false : dto.activeLowStock,
        lowStock: variationEntities.length > 0 ? 0 : dto.lowStock,
        supplier: supplier ?? undefined,
        images: images,
        variations: variationEntities,
        color: variationEntities.length > 0 ? null : (dto.color ?? undefined),
        size: variationEntities.length > 0 ? null : (dto.size ?? undefined),
      });

      this.disableIfOutOfStock(product);

      const savedProduct = await this.repo.save(product);

      this.logger.log(
        `create:success ${toLogString({
          id: savedProduct.id,
        })}`,
      );

      return await this.findOne(savedProduct.id, companyId);
    } catch (err) {
      this.logger.error(err);

      throw err;
    }
  }

  async findAll(companyId: string): Promise<ProductResponseDto[]> {
    const products = await this.repo.find({
      where: { companyId: companyId },
      relations: {
        images: true,
        supplier: true,
        variations: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return plainToInstance(ProductResponseDto, products, {
      excludeExtraneousValues: true,
    });
  }
  // async findAll(
  //   companyId: string,
  //   pagination: PaginationRequestDto,
  // ): Promise<PaginationResponseDto<ProductResponseDto>> {
  //   const { limit = 12, page = 1 } = pagination;
  //   const offset = (page - 1) * limit;
  //   const [products, total] = await this.repo.findAndCount({
  //     where: { companyId: companyId },
  //     relations: {
  //       images: true,
  //       supplier: true,
  //       variations: true,
  //     },
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //     take: limit,
  //     skip: offset,
  //   });

  //   const totalPage = Math.ceil(total / limit);

  //   const data = plainToInstance(ProductResponseDto, products, {
  //     excludeExtraneousValues: true,
  //   });
  //   return {
  //     data,
  //     total,
  //     limit,
  //     page,
  //     totalPage,
  //   };
  // }

  async findOne(id: string, companyId: string) {
    const product = await this.repo.findOne({
      where: { id, companyId },

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
    companyId: string,
    files?: Express.Multer.File[],
    variationFilesMap?: Map<number, Express.Multer.File>,
  ) {
    const product = await this.findOne(id, companyId);
    const switchesToVariations = Boolean(dto.variations?.length);

    if (switchesToVariations) {
      const productImageIds = (product.images ?? []).map((image) => image.id);
      if (productImageIds.length > 0) {
        await this.imageService.deleteImages(productImageIds, companyId);
      }
      product.images = [];
    } else if (dto.imageIds !== undefined) {
      const currentImageIds = product.images.map((img) => img.id);
      const imageIdsToKeep = dto.imageIds || [];
      const imageIdsToDelete = currentImageIds.filter(
        (imgId) => !imageIdsToKeep.includes(imgId),
      );

      if (imageIdsToDelete.length > 0) {
        await this.imageService.deleteImages(imageIdsToDelete, companyId);
        product.images = product.images.filter(
          (img) => !imageIdsToDelete.includes(img.id),
        );
      }
    }

    if (!switchesToVariations && files && files.length > 0) {
      const newImages = await this.imageService.createImages(files, companyId);
      product.images = [...product.images, ...newImages];
    }

    const {
      variations: variationDtos,
      supplierId,
      category,
      price,
      promoPrice,
      color,
      size,
      ...updateData
    } = dto;
    delete updateData.imageIds;

    Object.assign(product, updateData);

    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (promoPrice !== undefined) product.promoPrice = promoPrice;
    if (color !== undefined) product.color = color;
    if (size !== undefined) product.size = size;

    if (supplierId !== undefined) {
      if (supplierId === null) {
        product.supplier = null;
      } else {
        const supplier = await this.supplierRepo.findOne({
          where: { id: supplierId, companyId },
        });
        if (!supplier) {
          throw new NotFoundException('Fornecedor não encontrado');
        }
        product.supplier = supplier;
      }
    }

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
            .andWhere('sm."companyId" = :companyId', { companyId })
            .getRawOne<{ count: string }>();

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
            const result =
              await this.imageService.uploadToCloudinary(variationFile);
            imageUrl = result.secure_url;
          }
          return Object.assign(new ProductVariationEntity(), {
            ...(existing && { id: existing.id }),
            name: `${v.color} ${v.size}`,
            companyId,
            barCode: v.barCode ?? existing?.barCode,
            price: v.price?.toString(),
            stock: v.stock,
            color: v.color,
            size: v.size,
            imageUrl: imageUrl ?? existing?.imageUrl,
            isActive: v.isActive ?? true,
            activeLowStock: v.activeLowStock,
            lowStock: v.activeLowStock ? Math.max(1, v.lowStock ?? 5) : 0,
          });
        }),
      );
      product.variations = variationEntities;

      if (variationDtos.length > 0) {
        product.price = null;
        product.promoPrice = null;
        product.stock = null;
        product.activeLowStock = false;
        product.lowStock = 0;
        product.color = null;
        product.size = null;
      }
    }

    this.disableIfOutOfStock(product);

    return await this.repo.save(product);
  }

  async remove(id: string, companyId: string) {
    const product = await this.findOne(id, companyId);

    await this.repo.remove(product);

    return {
      message: 'Produto deletado com sucesso',
    };
  }

  async updateStock(
    id: string,
    quantity: number,
    type: StockMovementType,
    companyId: string,
  ) {
    this.logger.log(`updateStock:start ${toLogString({ id, quantity, type })}`);

    try {
      const product = await this.findOne(id, companyId);
      if (typeof product.stock === 'number') {
        if (type === StockMovementType.IN) {
          if (product.stock <= 0) {
            product.status = ProductStatusEnum.DISABLED;
          }
          product.stock += quantity;
        } else {
          product.stock -= quantity;
        }
        this.disableIfOutOfStock(product);
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

  async importProducts(file: Express.Multer.File, companyId: string) {
    if (!file) {
      throw new BadRequestException('Envie uma planilha.');
    }

    if (!companyId) {
      throw new BadRequestException('Empresa não encontrada.');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet);

    const productsToCreate = rows.map((row: any, index) => {
      if (!row.name || !row.price) {
        throw new BadRequestException(
          `Linha ${index + 2}: nome e preço de venda são obrigatórios.`,
        );
      }
      return {
        name: row.name,
        category: row.category || null,
        salePrice: Number(row.price),
        stock: row.stock ? Number(row.stock) : 0,
        barcode: row.barcode ? String(row.barCode) : null,
        companyId: companyId,
      };
    });

    await this.repo.save(productsToCreate);

    return {
      message: 'Produtos importados com sucesso.',
      total: productsToCreate.length,
    };
  }
}
