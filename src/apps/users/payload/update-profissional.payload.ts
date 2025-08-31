import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { ProfessionalType } from '../enums/professional-type.enum';

export class UpdateProfissionalPayload {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @EmptyToUndefined()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @EmptyToUndefined()
  name?: string;

  @ApiPropertyOptional()
  @IsEnum(ProfessionalType)
  @IsOptional()
  type?: ProfessionalType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @EmptyToUndefined()
  speciality?: string;
}
