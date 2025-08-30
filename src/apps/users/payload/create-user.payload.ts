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

import { UserRole } from '../enums/user-role.enum';
import { CreateAdministratorPayload } from './create-administrator.payload';
import { CreatePatientPayload } from './create-patient.payload';
import { CreateProfessionalPayload } from './create-professional.payload';

export class CreateUserPayload {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => CreateAdministratorPayload)
  @ValidateIf((payload) => payload.role === UserRole.ADMIN)
  @IsNotEmpty()
  administrator: CreateAdministratorPayload;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => CreateProfessionalPayload)
  @ValidateIf((payload) => payload.role === UserRole.PROFESSIONAL)
  @IsNotEmpty()
  professional: CreateProfessionalPayload;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => CreatePatientPayload)
  @ValidateIf((payload) => payload.role === UserRole.PATIENT)
  @IsNotEmpty()
  patient: CreatePatientPayload;
}
