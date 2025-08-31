import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';

export class UpdatePasswordPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  newPassword: string;
}
