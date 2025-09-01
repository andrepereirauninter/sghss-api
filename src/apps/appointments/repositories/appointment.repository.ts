import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { paginate } from '../../../common/helpers/paginate.helper';
import { BaseRepository } from '../../../common/repositories/base-repository';
import { Appointment } from '../entities/appointment.entity';
import { FilterAllAppointmentsPayload } from '../payload/filter-all-appointments.payload';

@Injectable()
export class AppointmentRepository extends BaseRepository<Appointment> {
  constructor(
    @InjectRepository(Appointment)
    repository: BaseRepository<Appointment>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findAll(payload: FilterAllAppointmentsPayload) {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      status,
      type,
      notes = '',
      medicId,
      patientId,
      unitId,
    } = payload;

    const query = this.createQueryBuilder('appointment')
      .leftJoin('appointment.medic', 'medic')
      .leftJoin('appointment.patient', 'patient')
      .leftJoin('appointment.unit', 'unit')
      .where('appointment.notes ILIKE :notes', { notes: `%${notes}%` });

    if (startDate) {
      query.andWhere('appointment.startDate::date >= :startDate', {
        startDate,
      });
    }

    if (endDate) {
      query.andWhere('appointment.endDate::date <= :endDate', { endDate });
    }

    if (status?.length) {
      query.andWhere('appointment.status IN (:...status)', { status });
    }

    if (type?.length) {
      query.andWhere('appointment.type IN (:...type)', { type });
    }

    if (medicId?.length) {
      query.andWhere('medic.id IN (:...medicId)', { medicId });
    }

    if (patientId?.length) {
      query.andWhere('patient.id IN (:...patientId)', { patientId });
    }

    if (unitId?.length) {
      query.andWhere('unit.id IN (:...unitId)', { unitId });
    }

    query
      .select([
        'appointment.id',
        'appointment.createdAt',
        'appointment.date',
        'appointment.status',
        'appointment.type',
        'appointment.notes',
        'medic.id',
        'medic.name',
        'patient.id',
        'patient.name',
        'unit.id',
        'unit.code',
        'unit.name',
      ])
      .orderBy('appointment.createdAt', 'DESC');

    return paginate(query, page, limit);
  }

  findDetails(id: string) {
    return this.createQueryBuilder('appointment')
      .leftJoin('appointment.medic', 'medic')
      .leftJoin('appointment.patient', 'patient')
      .leftJoin('appointment.unit', 'unit')
      .where('appointment.id = :id', { id })
      .select([
        'appointment.id',
        'appointment.createdAt',
        'appointment.date',
        'appointment.status',
        'appointment.type',
        'appointment.notes',
        'medic.id',
        'medic.name',
        'patient.id',
        'patient.name',
        'unit.id',
        'unit.code',
        'unit.name',
      ])
      .getOne();
  }
}
