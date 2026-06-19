import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  IsIn,
  IsInt,
  Min,
} from 'class-validator';

const SUPPLIER_STATUS = ['active', 'inactive'] as const;

export class SupplierRequestDto {
  @IsString()
  @MaxLength(180)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  location?: string;

  @IsOptional()
  @IsIn(SUPPLIER_STATUS)
  status?: (typeof SUPPLIER_STATUS)[number];

  @IsOptional()
  @IsString()
  @MaxLength(16)
  avatarColor?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  openOrders?: number;
}
