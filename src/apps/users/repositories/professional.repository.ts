import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from '../../../common/repositories/base-repository';
import { Professional } from '../entities/professional.entity';

@Injectable()
export class ProfessionalRepository extends BaseRepository<Professional> {
  constructor(
    @InjectRepository(Professional)
    repository: BaseRepository<Professional>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
