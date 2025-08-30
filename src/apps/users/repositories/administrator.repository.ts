import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from '../../../common/repositories/base-repository';
import { Administrator } from '../entities/administrator.entity';

@Injectable()
export class AdministratorRepository extends BaseRepository<Administrator> {
  constructor(
    @InjectRepository(Administrator)
    repository: BaseRepository<Administrator>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
