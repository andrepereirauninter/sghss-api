import {
  Body,
  Controller,
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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentPayload } from './payload/create-appointment.payload';
import { FilterAllAppointmentsPayload } from './payload/filter-all-appointments.payload';
import { UpdateAppointmentPayload } from './payload/update-appointment.payload';

@Controller('appointments')
@ApiTags('Appointment')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar consultas.',
  })
  @ApiOkResponse({
    description: 'Consultas listadas com sucesso.',
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
  @Roles(UserRole.PROFESSIONAL, UserRole.PATIENT)
  findAll(@Query() payload: FilterAllAppointmentsPayload) {
    return this.service.findAll(payload);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova consulta.',
  })
  @ApiCreatedResponse({
    description: 'Consulta criada com sucesso.',
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
  create(@Body() payload: CreateAppointmentPayload) {
    return this.service.create(payload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter detalhes de uma consulta.',
  })
  @ApiCreatedResponse({
    description: 'Detalhes de uma consulta obtidos com sucesso.',
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
    description: 'Consulta não encontrada.',
  })
  @JwtAuth()
  @Roles(UserRole.PROFESSIONAL, UserRole.PATIENT)
  findDetails(@Param('id') id: string) {
    return this.service.findDetails(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar uma consulta.',
  })
  @ApiNoContentResponse({
    description: 'Consulta atualizada com sucesso.',
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
    description: 'Consulta não encontrada.',
  })
  @JwtAuth()
  @Roles(UserRole.PROFESSIONAL)
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdateAppointmentPayload,
  ) {
    return this.service.update(id, payload);
  }
}
