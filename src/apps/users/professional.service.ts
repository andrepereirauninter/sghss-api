import { In } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { ProfessionalType } from './enums/professional-type.enum';
import { ProfessionalRepository } from './repositories/professional.repository';

@Injectable()
export class ProfessionalService {
  constructor(private readonly repository: ProfessionalRepository) {}

  findByIds(ids: string[]) {
    return this.repository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findMedicById(id: string) {
    return this.repository.findOne({
      where: {
        id,
        type: ProfessionalType.MEDIC,
      },
    });
  }
}
