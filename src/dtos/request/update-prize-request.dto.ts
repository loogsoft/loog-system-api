import { PartialType } from '@nestjs/mapped-types';
import { PrizeRequestDto } from './prize-request.dto';

export class UpdatePrizeRequestDto extends PartialType(PrizeRequestDto) {}
