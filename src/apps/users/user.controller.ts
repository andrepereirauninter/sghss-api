import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { apiResponses } from '../../common/constants/swagger';
import { JwtAuth } from '../auth/decorators/jwt-auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { CreateUserPayload } from './payload/create-user.payload';
import { FilterAllUsersPayload } from './payload/filter-all-users.payload';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar usuários.',
  })
  @ApiOkResponse({
    description: 'Usuários listados com sucesso.',
  })
  @ApiBadRequestResponse({
    description: apiResponses.badRequestWithValidation,
  })
  @ApiUnauthorizedResponse({
    description: apiResponses.unauthorizedDefaultMessage,
  })
  @ApiForbiddenResponse({
    description: apiResponses.forbiddenDefaultMessage,
  })
  @JwtAuth()
  @Roles(UserRole.ADMIN)
  findAll(@Query() payload: FilterAllUsersPayload) {
    return this.service.findAll(payload);
  }

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
  @ApiUnauthorizedResponse({
    description: apiResponses.unauthorizedDefaultMessage,
  })
  @ApiForbiddenResponse({
    description: apiResponses.forbiddenDefaultMessage,
  })
  @JwtAuth()
  @Roles(UserRole.ADMIN)
  create(@Body() payload: CreateUserPayload) {
    return this.service.create(payload);
  }
}
