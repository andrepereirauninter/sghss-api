import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
