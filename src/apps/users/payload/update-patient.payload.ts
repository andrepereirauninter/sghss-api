import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { IsOnlyDate } from '../../../common/decorators/is-only-date.decorator';

export class UpdatePatientPayload {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @EmptyToUndefined()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  cpf: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  name: string;

  @ApiProperty()
  @IsOnlyDate()
  @IsNotEmpty()
  @EmptyToUndefined()
  birthDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  contact: string;
}
