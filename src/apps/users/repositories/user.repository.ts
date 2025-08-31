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

  async findActiveByEmail(email: string) {
    return this.createQueryBuilder('user')
      .leftJoin('user.administrator', 'administrator')
      .leftJoin('user.professional', 'professional')
      .leftJoin('user.patient', 'patient')
      .where('user.email = :email', { email })
      .andWhere('user.active = :active', { active: true })
      .select([
        'user.id',
        'user.email',
        'user.password',
        'user.active',
        'user.role',
        'administrator.id',
        'administrator.name',
        'professional.id',
        'professional.name',
        'professional.speciality',
        'professional.type',
        'patient.id',
        'patient.cpf',
        'patient.name',
        'patient.birthDate',
        'patient.contact',
      ])
      .getOne();
  }
}
