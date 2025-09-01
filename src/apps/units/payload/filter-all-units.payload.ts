import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { QueryStringToArray } from '../../../common/decorators/query-string-to-array.decorator';
import { QueryStringToBoolean } from '../../../common/decorators/query-string-to-boolean.decorator';
import { PaginationPayload } from '../../../common/payload/pagination.payload';
import { UnitType } from '../../users/enums/unit-type.enum';

export class FilterAllUnitsPayload extends PaginationPayload {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @EmptyToUndefined()
  code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @EmptyToUndefined()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @EmptyToUndefined()
  address?: string;

  @ApiPropertyOptional()
  @IsEnum(UnitType, { each: true })
  @IsOptional()
  @QueryStringToArray()
  type?: UnitType[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @QueryStringToBoolean()
  active?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  professionalName?: string;
}
