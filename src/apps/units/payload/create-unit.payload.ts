import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { UnitType } from '../../users/enums/unit-type.enum';

export class CreateUnitPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  address: string;

  @ApiProperty()
  @IsEnum(UnitType)
  @IsNotEmpty()
  type: UnitType;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @ApiProperty()
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  @ArrayNotEmpty()
  professionals: string[];
}
