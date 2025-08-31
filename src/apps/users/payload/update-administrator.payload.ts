import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';

export class UpdateAdministratorPayload {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @EmptyToUndefined()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  name?: string;
}
