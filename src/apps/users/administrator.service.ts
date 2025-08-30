import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { CreateAdministratorPayload } from './payload/create-administrator.payload';
import { AdministratorRepository } from './repositories/administrator.repository';

@Injectable()
export class AdministratorService {
  constructor(private readonly repository: AdministratorRepository) {}

  async create(
    payload: CreateAdministratorPayload,
    userId: string,
    queryRunner: QueryRunner,
  ) {
    const administrator = this.repository.create({
      ...payload,
      userId,
    });

    await queryRunner.manager.save(administrator);
  }
}
