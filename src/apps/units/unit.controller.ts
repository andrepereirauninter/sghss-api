import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { apiResponses } from '../../common/constants/swagger';
import { JwtAuth } from '../auth/decorators/jwt-auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateUnitPayload } from './payload/create-unit.payload';
import { FilterAllUnitsPayload } from './payload/filter-all-units.payload';
import { FilterSearchUnitsPayload } from './payload/filter-search-units.payload';
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
}
