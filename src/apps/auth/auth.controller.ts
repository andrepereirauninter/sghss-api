import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { apiResponses } from '../../common/constants/swagger';
import { AuthService } from './auth.service';
import { LoginPayload } from './payload/login.payload';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Efetuar login.' })
  @ApiOkResponse({
    description: 'Usuário logado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: apiResponses.badRequestWithValidation,
  })
  login(@Body() payload: LoginPayload) {
    return this.service.login(payload);
  }
}
