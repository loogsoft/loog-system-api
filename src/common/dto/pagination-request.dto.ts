import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationRequestDto {
  @IsOptional()
  @IsInt()
  @Min(12)
  @Type(() => Number)
  limit: number;
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;
}
