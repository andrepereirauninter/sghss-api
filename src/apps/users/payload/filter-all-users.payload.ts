import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { QueryStringToArray } from '../../../common/decorators/query-string-to-array.decorator';
import { QueryStringToBoolean } from '../../../common/decorators/query-string-to-boolean.decorator';
import { PaginationPayload } from '../../../common/payload/pagination.payload';
import { UserRole } from '../enums/user-role.enum';

export class FilterAllUsersPayload extends PaginationPayload {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @EmptyToUndefined()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @EmptyToUndefined()
  name?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @QueryStringToBoolean()
  active?: boolean;

  @ApiPropertyOptional()
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  @EmptyToUndefined()
  @QueryStringToArray()
  role?: UserRole[];
}
