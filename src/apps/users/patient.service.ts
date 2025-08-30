import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { CreatePatientPayload } from './payload/create-patient.payload';
import { PatientRepository } from './repositories/patient.repository';

@Injectable()
export class PatientService {
  constructor(private readonly repository: PatientRepository) {}

  async create(
    payload: CreatePatientPayload,
    userId: string,
    queryRunner: QueryRunner,
  ) {
    const patient = this.repository.create({
      ...payload,
      userId,
    });

    await queryRunner.manager.save(patient);
  }
}
