import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { apiResponses } from '../../common/constants/swagger';
import { UUIDValidationPipe } from '../../common/pipes/uuid-validation.pipe';
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

  @Get(':id')
  @ApiOperation({
    summary: 'Obter detalhes de um usuário.',
  })
  @ApiCreatedResponse({
    description: 'Detalhes de um usuário obtidos com sucesso.',
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
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
  })
  @JwtAuth()
  @Roles(UserRole.ADMIN)
  getDetails(@Param('id', UUIDValidationPipe) id: string) {
    return this.service.getDetails(id);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Ativar um usuário.',
  })
  @ApiNoContentResponse({
    description: 'Usuário ativado com sucesso.',
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
  activate(@Param('id', UUIDValidationPipe) id: string) {
    return this.service.activate(id);
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Desativar um usuário.',
  })
  @ApiNoContentResponse({
    description: 'Usuário desativado com sucesso.',
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
  deactivate(@Param('id', UUIDValidationPipe) id: string) {
    return this.service.deactivate(id);
  }
}
