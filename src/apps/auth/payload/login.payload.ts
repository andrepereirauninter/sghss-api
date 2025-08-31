import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginPayload {
  @ApiProperty({
    description: 'E-mail do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: 'Password@123', description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
