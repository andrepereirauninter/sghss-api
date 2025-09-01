import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { IsValidPassword } from '../../../common/decorators/is-valid-password.decorator';
import { UserRole } from '../enums/user-role.enum';
import { CreateAdministratorPayload } from './create-administrator.payload';
import { CreatePatientPayload } from './create-patient.payload';
import { CreateProfessionalPayload } from './create-professional.payload';

export class CreateUserPayload {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @EmptyToUndefined()
  email: string;

  @ApiProperty()
  @IsString()
  @IsValidPassword()
  @IsNotEmpty()
  @EmptyToUndefined()
  password: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  acceptedTerms: boolean;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => CreateAdministratorPayload)
  @ValidateIf((payload) => payload.role === UserRole.ADMIN)
  @IsNotEmpty()
  administrator?: CreateAdministratorPayload;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => CreateProfessionalPayload)
  @ValidateIf((payload) => payload.role === UserRole.PROFESSIONAL)
  @IsNotEmpty()
  professional?: CreateProfessionalPayload;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => CreatePatientPayload)
  @ValidateIf((payload) => payload.role === UserRole.PATIENT)
  @IsNotEmpty()
  patient?: CreatePatientPayload;
}
