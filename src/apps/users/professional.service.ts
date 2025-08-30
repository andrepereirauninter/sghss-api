import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { CreateProfessionalPayload } from './payload/create-professional.payload';
import { ProfessionalRepository } from './repositories/professional.repository';

@Injectable()
export class ProfessionalService {
  constructor(private readonly repository: ProfessionalRepository) {}

  async create(
    payload: CreateProfessionalPayload,
    userId: string,
    queryRunner: QueryRunner,
  ) {
    const professional = this.repository.create({
      ...payload,
      userId,
    });

    await queryRunner.manager.save(professional);
  }
}
