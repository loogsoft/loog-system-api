import { IsDateString, IsOptional, Matches } from 'class-validator';

export class StockOperationQueryDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date deve estar no formato YYYY-MM-DD.',
  })
  @IsDateString({ strict: true }, { message: 'date deve ser uma data válida.' })
  date?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate deve estar no formato YYYY-MM-DD.',
  })
  @IsDateString(
    { strict: true },
    { message: 'startDate deve ser uma data válida.' },
  )
  startDate?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate deve estar no formato YYYY-MM-DD.',
  })
  @IsDateString(
    { strict: true },
    { message: 'endDate deve ser uma data válida.' },
  )
  endDate?: string;
}
