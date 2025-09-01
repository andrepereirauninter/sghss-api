import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { IsOnlyDate } from '../../../common/decorators/is-only-date.decorator';
import { QueryStringToArray } from '../../../common/decorators/query-string-to-array.decorator';
import { PaginationPayload } from '../../../common/payload/pagination.payload';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { AppointmentType } from '../enums/appointment-type.enum';

export class FilterAllAppointmentsPayload extends PaginationPayload {
  @ApiPropertyOptional()
  @IsOnlyDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOnlyDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsEnum(AppointmentStatus, { each: true })
  @IsOptional()
  @QueryStringToArray()
  status?: AppointmentStatus[];

  @ApiPropertyOptional()
  @IsEnum(AppointmentType, { each: true })
  @IsOptional()
  @QueryStringToArray()
  type?: AppointmentType[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @EmptyToUndefined()
  notes?: string;

  @ApiPropertyOptional()
  @IsUUID(4, { each: true })
  @IsOptional()
  @EmptyToUndefined()
  @QueryStringToArray()
  medicId?: string[];

  @ApiPropertyOptional()
  @IsUUID(4, { each: true })
  @IsOptional()
  @EmptyToUndefined()
  @QueryStringToArray()
  patientId?: string[];

  @ApiPropertyOptional()
  @IsUUID(4, { each: true })
  @IsOptional()
  @EmptyToUndefined()
  @QueryStringToArray()
  unitId?: string[];
}
