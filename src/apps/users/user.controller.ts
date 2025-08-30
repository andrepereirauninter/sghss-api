import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { apiResponses } from '../../common/constants/swagger';
import { CreateUserPayload } from './payload/create-user.payload';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo usuário.',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: apiResponses.badRequestWithValidation,
  })
  create(@Body() payload: CreateUserPayload) {
    return this.service.create(payload);
  }
}
