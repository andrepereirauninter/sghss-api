import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { AppointmentType } from '../enums/appointment-type.enum';

export class CreateAppointmentPayload {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsEnum(AppointmentType)
  @IsNotEmpty()
  type: AppointmentType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  notes: string;

  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  @EmptyToUndefined()
  medicId: string;

  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  @EmptyToUndefined()
  patientId: string;

  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  @EmptyToUndefined()
  unitId: string;
}
