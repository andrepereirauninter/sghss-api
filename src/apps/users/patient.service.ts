import { Injectable } from '@nestjs/common';

import { PatientRepository } from './repositories/patient.repository';

@Injectable()
export class PatientService {
  constructor(private readonly repository: PatientRepository) {}

  async findByCpf(cpf: string) {
    return this.repository.findOne({
      where: {
        cpf,
      },
    });
  }

  async findById(id: string) {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }
}
