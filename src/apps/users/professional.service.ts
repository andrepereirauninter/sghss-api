import { In } from 'typeorm';

import { Injectable } from '@nestjs/common';

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
}
