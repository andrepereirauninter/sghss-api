import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { EmptyToUndefined } from '../../../common/decorators/empty-to-undefined.decorator';

export class CreateAdministratorPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @EmptyToUndefined()
  name: string;
}
