import { PartialType } from '@nestjs/mapped-types';
import { CompanyRequestDto } from './company-request.dto';

export class UpdateCompanyRequestDto extends PartialType(CompanyRequestDto) {}
