import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AsaasPaymentDto {
  @IsOptional()
  @IsString()
  object?: string;

  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  dateCreated?: string;

  @IsString()
  customer: string;

  @IsOptional()
  @IsString()
  subscription: string | null;

  @IsOptional()
  @IsString()
  checkoutSession?: string | null;

  @IsOptional()
  @IsString()
  paymentLink?: string | null;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  netValue?: number | null;

  @IsOptional()
  @IsNumber()
  originalValue?: number | null;

  @IsOptional()
  @IsNumber()
  interestValue?: number | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsString()
  billingType: string;

  @IsOptional()
  @IsObject()
  creditCard?: Record<string, unknown> | null;

  @IsOptional()
  @IsBoolean()
  canBePaidAfterDueDate?: boolean;

  @IsOptional()
  @IsObject()
  pixTransaction?: Record<string, unknown> | null;

  @IsString()
  status: string;

  @IsString()
  dueDate: string;

  @IsOptional()
  @IsString()
  originalDueDate?: string | null;

  @IsOptional()
  @IsString()
  paymentDate: string | null;

  @IsOptional()
  @IsString()
  clientPaymentDate?: string | null;

  @IsOptional()
  @IsDateString()
  confirmedDate?: string | null;

  @IsOptional()
  @IsNumber()
  installmentNumber?: number | null;

  @IsOptional()
  @IsString()
  invoiceUrl?: string | null;

  @IsOptional()
  @IsString()
  invoiceNumber?: string | null;

  @IsOptional()
  @IsString()
  externalReference: string | null;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;

  @IsOptional()
  @IsBoolean()
  anticipated?: boolean;

  @IsOptional()
  @IsBoolean()
  anticipable?: boolean;

  @IsOptional()
  @IsString()
  creditDate?: string | null;

  @IsOptional()
  @IsString()
  estimatedCreditDate?: string | null;

  @IsOptional()
  @IsString()
  transactionReceiptUrl?: string | null;

  @IsOptional()
  @IsString()
  nossoNumero?: string | null;

  @IsOptional()
  @IsString()
  bankSlipUrl?: string | null;

  @IsOptional()
  @IsString()
  lastInvoiceViewedDate?: string | null;

  @IsOptional()
  @IsString()
  lastBankSlipViewedDate?: string | null;

  @IsOptional()
  @IsObject()
  discount?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  fine?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  interest?: Record<string, unknown> | null;

  @IsOptional()
  @IsBoolean()
  postalService?: boolean;

  @IsOptional()
  @IsObject()
  escrow?: Record<string, unknown> | null;

  @IsOptional()
  @IsArray()
  refunds?: unknown[] | null;
}

export class AsaasWebhookDto {
  @IsString()
  id: string;

  @IsString()
  event: string;

  @IsString()
  dateCreated: string;

  @IsObject()
  account: Record<string, unknown>;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AsaasPaymentDto)
  payment: AsaasPaymentDto;
}
