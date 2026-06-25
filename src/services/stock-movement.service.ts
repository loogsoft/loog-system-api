import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovementEntity } from 'src/entities/stock-movement.entity';
import { toLogString } from 'src/utils/logging';

@Injectable()
export class StockMovementService {
  private readonly logger = new Logger(StockMovementService.name);

  constructor(
    @InjectRepository(StockMovementEntity)
    private readonly repo: Repository<StockMovementEntity>,
  ) {}

  async findAll() {
    this.logger.log('findAll:start');

    try {
      const movements = await this.repo.find({
        relations: ['operation', 'variation', 'product'],
        order: { createdAt: 'DESC' },
      });

      this.logger.log(
        `findAll:success ${toLogString({ count: movements.length })}`,
      );

      return movements.map((movement) => this.toResponse(movement));
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findAll:error', errorStack);
      throw err;
    }
  }

  async findByVariation(variationId: string) {
    this.logger.log(`findByVariation:start ${toLogString({ variationId })}`);

    try {
      const movements = await this.repo.find({
        where: { variation: { id: variationId } },
        relations: ['operation', 'variation', 'product'],
        order: { createdAt: 'DESC' },
      });

      this.logger.log(
        `findByVariation:success ${toLogString({ count: movements.length })}`,
      );

      return movements.map((movement) => this.toResponse(movement));
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : String(err);
      this.logger.error('findByVariation:error', errorStack);
      throw err;
    }
  }

  private toResponse(movement: StockMovementEntity) {
    return {
      ...movement,
      type: movement.operation?.type ?? movement.type,
      reason: movement.operation?.reason ?? movement.reason,
      paymentMethod:
        movement.operation?.paymentMethod ?? movement.paymentMethod,
      responsibleName:
        movement.operation?.responsibleName ?? movement.responsibleName,
      responsibleEmail:
        movement.operation?.responsibleEmail ?? movement.responsibleEmail,
      observation: movement.operation?.observation ?? movement.observation,
      companyId: movement.operation?.companyId ?? movement.companyId,
      createdAt: movement.createdAt ?? movement.operation?.createdAt,
    };
  }
}
