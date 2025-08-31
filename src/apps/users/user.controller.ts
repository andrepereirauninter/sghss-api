import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
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
import { FilterSearchUsersPayload } from './payload/filter-search-users.payload';
import { UpdateAdministratorPayload } from './payload/update-administrator.payload';
import { UpdatePasswordPayload } from './payload/update-password.payload';
import { UpdatePatientPayload } from './payload/update-patient.payload';
import { UpdateProfissionalPayload } from './payload/update-profissional.payload';
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

  @Get('search')
  @ApiOperation({
    summary: 'Buscar usuários para serem usados em select',
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
  search(@Query() payload: FilterSearchUsersPayload) {
    return this.service.search(payload);
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

  @Put('administrator/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar um administrador',
  })
  @ApiNoContentResponse({
    description: 'Administrador atualizado com sucesso.',
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
  updateAdministrator(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdateAdministratorPayload,
  ) {
    return this.service.updateAdministrator(id, payload);
  }

  @Put('patient/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar um paciente',
  })
  @ApiNoContentResponse({
    description: 'Paciente atualizado com sucesso.',
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
  updatePatient(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdatePatientPayload,
  ) {
    return this.service.updatePatient(id, payload);
  }

  @Put('professional/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar um profissional de saúde',
  })
  @ApiNoContentResponse({
    description: 'Profissional de saúde atualizado com sucesso.',
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
  updateProfissional(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdateProfissionalPayload,
  ) {
    return this.service.updateProfessional(id, payload);
  }

  @Patch(':id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: `Atualizar senha do usuário`,
  })
  @ApiNoContentResponse({
    description: 'Senha atualizada com sucesso.',
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
  updatePassword(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdatePasswordPayload,
  ) {
    return this.service.updatePassword(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover um usuário',
  })
  @ApiNoContentResponse({
    description: 'Usuário removido com sucesso.',
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
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
