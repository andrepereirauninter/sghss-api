import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateAdministratorPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
