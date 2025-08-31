import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { QueryStringToArray } from '../../../common/decorators/query-string-to-array.decorator';
import { UserRole } from '../enums/user-role.enum';

export class FilterSearchPayload {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @EmptyToUndefined()
  name?: string;

  @ApiPropertyOptional()
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  @EmptyToUndefined()
  @QueryStringToArray()
  role?: UserRole[];
}
