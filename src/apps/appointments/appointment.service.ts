import { Injectable, NotFoundException } from '@nestjs/common';

import { UnitService } from '../units/unit.service';
import { PatientService } from '../users/patient.service';
import { ProfessionalService } from '../users/professional.service';
import { CreateAppointmentPayload } from './payload/create-appointment.payload';
import { FilterAllAppointmentsPayload } from './payload/filter-all-appointments.payload';
import { UpdateAppointmentPayload } from './payload/update-appointment.payload';
import { AppointmentRepository } from './repositories/appointment.repository';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly repository: AppointmentRepository,
    private readonly professionalService: ProfessionalService,
    private readonly unitService: UnitService,
    private readonly patientService: PatientService,
  ) {}

  findAll(payload: FilterAllAppointmentsPayload) {
    return this.repository.findAll(payload);
  }

  async create(payload: CreateAppointmentPayload) {
    const { unitId, patientId, medicId } = payload;

    const unit = await this.unitService.findById(unitId);

    if (!unit) {
      throw new NotFoundException(
        `Unidade com ID ${unitId} não foi encontrada.`,
      );
    }

    const patient = await this.patientService.findById(patientId);

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${patientId} não foi encontrado.`,
      );
    }

    const medic = await this.professionalService.findMedicById(medicId);

    if (!medic) {
      throw new NotFoundException(
        `Médico com ID ${medicId} não foi encontrado.`,
      );
    }

    const savedAppointment = await this.repository.save({
      ...payload,
      unit,
      patient,
      medic,
    });

    return {
      id: savedAppointment.id,
    };
  }

  async findDetails(id: string) {
    const appointment = await this.repository.findDetails(id);

    if (!appointment) {
      throw new NotFoundException(`Consulta de ID ${id} não foi encontrada.`);
    }

    return appointment;
  }

  async update(id: string, payload: UpdateAppointmentPayload) {
    const appointment = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Consulta com ID ${id} não foi encontrada.`);
    }

    const { unitId, patientId, medicId } = payload;

    const unit = await this.unitService.findById(unitId);

    if (!unit) {
      throw new NotFoundException(
        `Unidade com ID ${unitId} não foi encontrada.`,
      );
    }

    const patient = await this.patientService.findById(patientId);

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${patientId} não foi encontrado.`,
      );
    }

    const medic = await this.professionalService.findMedicById(medicId);

    if (!medic) {
      throw new NotFoundException(
        `Médico com ID ${medicId} não foi encontrado.`,
      );
    }

    await this.repository.save({
      ...appointment,
      ...payload,
      unit,
      patient,
      medic,
    });
  }
}
