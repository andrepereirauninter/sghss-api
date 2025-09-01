import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';
import { QueryStringToArray } from '../../../common/decorators/query-string-to-array.decorator';
import { ProfessionalType } from '../enums/professional-type.enum';
import { UserRole } from '../enums/user-role.enum';

export class FilterSearchUsersPayload {
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

  @ApiPropertyOptional()
  @IsEnum(ProfessionalType, { each: true })
  @IsOptional()
  @EmptyToUndefined()
  @QueryStringToArray()
  professionalType?: ProfessionalType[];
}
