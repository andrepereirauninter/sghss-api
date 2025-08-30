import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from '../../../common/repositories/base-repository';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientRepository extends BaseRepository<Patient> {
  constructor(
    @InjectRepository(Patient)
    repository: BaseRepository<Patient>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
