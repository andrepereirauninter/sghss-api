import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { ProfessionalType } from '../enums/professional-type.enum';

export class CreateProfessionalPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(ProfessionalType)
  @IsNotEmpty()
  type: ProfessionalType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  speciality: string;
}
