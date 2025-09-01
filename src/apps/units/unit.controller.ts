import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { UserRole } from '../users/enums/user-role.enum';
import { CreateUnitPayload } from './payload/create-unit.payload';
import { FilterAllUnitsPayload } from './payload/filter-all-units.payload';
import { FilterSearchUnitsPayload } from './payload/filter-search-units.payload';
import { UpdateUnitPayload } from './payload/update-unit.payload';
import { UnitService } from './unit.service';

@Controller('units')
@ApiTags('Unit')
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar unidades.',
  })
  @ApiOkResponse({
    description: 'Unidades listadas com sucesso.',
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
  @Roles(UserRole.PROFESSIONAL)
  findAll(@Query() payload: FilterAllUnitsPayload) {
    return this.service.findAll(payload);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar unidades para serem usadas em select',
  })
  @ApiOkResponse({
    description: 'Unidades listadas com sucesso.',
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
  search(@Query() payload: FilterSearchUnitsPayload) {
    return this.service.search(payload);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova unidade.',
  })
  @ApiCreatedResponse({
    description: 'Unidade criada com sucesso.',
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
  @Roles(UserRole.PROFESSIONAL)
  create(@Body() payload: CreateUnitPayload) {
    return this.service.create(payload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter detalhes de uma unidade.',
  })
  @ApiCreatedResponse({
    description: 'Detalhes de uma unidade obtidos com sucesso.',
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
    description: 'Unidade não encontrada.',
  })
  @JwtAuth()
  @Roles(UserRole.PROFESSIONAL)
  findDetails(@Param('id') id: string) {
    return this.service.findDetails(id);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Ativar uma unidade.',
  })
  @ApiNoContentResponse({
    description: 'Unidade ativada com sucesso.',
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
    description: 'Unidade não encontrada.',
  })
  @JwtAuth()
  @Roles(UserRole.PROFESSIONAL)
  activate(@Param('id', UUIDValidationPipe) id: string) {
    return this.service.activate(id);
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Desativar uma unidade.',
  })
  @ApiNoContentResponse({
    description: 'Unidade desativada com sucesso.',
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
    description: 'Unidade não encontrada.',
  })
  @JwtAuth()
  @Roles(UserRole.PROFESSIONAL)
  deactivate(@Param('id', UUIDValidationPipe) id: string) {
    return this.service.deactivate(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar uma unidade.',
  })
  @ApiNoContentResponse({
    description: 'Unidade atualizada com sucesso.',
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
    description: 'Unidade não encontrada.',
  })
  @JwtAuth()
  @Roles(UserRole.PROFESSIONAL)
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdateUnitPayload,
  ) {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover uma unidade',
  })
  @ApiNoContentResponse({
    description: 'Unidade removida com sucesso.',
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
    description: 'Unidade não encontrada.',
  })
  @JwtAuth()
  @Roles(UserRole.PROFESSIONAL)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
