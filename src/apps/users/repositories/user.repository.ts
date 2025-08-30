import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from '../../../common/repositories/base-repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: BaseRepository<User>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
