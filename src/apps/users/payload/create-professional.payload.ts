import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { ProfessionalType } from '../enums/professional-type.enum';

export class CreateProfessionalPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  name: string;

  @ApiProperty()
  @IsEnum(ProfessionalType)
  @IsNotEmpty()
  type: ProfessionalType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  speciality: string;
}
