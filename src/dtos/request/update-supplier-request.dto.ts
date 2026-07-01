import { PartialType } from '@nestjs/mapped-types';
import { SupplierRequestDto } from './supplier-request.dto';

export class UpdateSupplierRequestDto extends PartialType(SupplierRequestDto) {}
