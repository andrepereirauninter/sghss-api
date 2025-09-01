import { Brackets } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { paginate } from '../../../common/helpers/paginate.helper';
import { BaseRepository } from '../../../common/repositories/base-repository';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { FilterAllUsersPayload } from '../payload/filter-all-users.payload';
import { FilterSearchUsersPayload } from '../payload/filter-search-users.payload';

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

  findAll(payload: FilterAllUsersPayload) {
    const {
      page = 1,
      limit = 10,
      email = '',
      active = true,
      name = '',
      role,
    } = payload;

    const query = this.createQueryBuilder('user')
      .leftJoin('user.administrator', 'administrator')
      .leftJoin('user.professional', 'professional')
      .leftJoin('user.patient', 'patient')
      .where('user.email ILIKE :email', { email: `%${email}%` })
      .andWhere('user.active = :active', { active })
      .andWhere(
        new Brackets((qb) => {
          qb.where('administrator.name ILIKE :name', { name: `%${name}%` })
            .orWhere('professional.name ILIKE :name', { name: `%${name}%` })
            .orWhere('patient.name ILIKE :name', { name: `%${name}%` });
        }),
      );

    if (role?.length) {
      query.andWhere('user.role IN (:...role)', { role });
    }

    query
      .select([
        'user.id',
        'user.createdAt',
        'user.email',
        'user.active',
        'user.role',
        'administrator.id',
        'administrator.name',
        'professional.id',
        'professional.name',
        'patient.id',
        'patient.name',
      ])
      .orderBy('user.createdAt', 'DESC');

    return paginate(query, page, limit);
  }

  search(
    payload: FilterSearchUsersPayload,
  ): Promise<{ id: string; name: string }[]> {
    const { name = '', role, professionalType } = payload;

    const query = this.createQueryBuilder('user')
      .leftJoin('user.administrator', 'administrator')
      .leftJoin('user.professional', 'professional')
      .leftJoin('user.patient', 'patient')
      .where((qb) => {
        qb.where('administrator.name ILIKE :name', { name: `%${name}%` })
          .orWhere('professional.name ILIKE :name', { name: `%${name}%` })
          .orWhere('patient.name ILIKE :name', { name: `%${name}%` });
      });

    if (role?.length) {
      query.andWhere('user.role IN (:...role)', { role });
    }

    if (professionalType?.length) {
      query.andWhere('professional.type IN (:...professionalType)', {
        professionalType,
      });
    }

    return query
      .select('user.id', 'id')
      .addSelect(
        'COALESCE(administrator.name, professional.name, patient.name)',
        'name',
      )
      .orderBy('user.createdAt', 'DESC')
      .getRawMany<{ id: string; name: string }>();
  }

  findDetails(id: string) {
    return this.createQueryBuilder('user')
      .leftJoin('user.administrator', 'administrator')
      .leftJoin('user.professional', 'professional')
      .leftJoin('user.patient', 'patient')
      .where('user.id = :id', { id })
      .select([
        'user.id',
        'user.createdAt',
        'user.email',
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

  findByIdWithRelations(id: string) {
    return this.findOne({
      where: { id },
      relations: {
        administrator: true,
        professional: true,
        patient: true,
      },
    });
  }

  findAdministratorById(id: string) {
    return this.createQueryBuilder('user')
      .leftJoin('user.administrator', 'administrator')
      .where('user.id = :id', { id })
      .andWhere('user.role = :role', { role: UserRole.ADMIN })
      .select([
        'user.id',
        'user.createdAt',
        'user.email',
        'user.active',
        'user.role',
        'administrator.id',
        'administrator.name',
      ])
      .getOne();
  }

  findProfessionalById(id: string) {
    return this.createQueryBuilder('user')
      .leftJoin('user.professional', 'professional')
      .where('user.id = :id', { id })
      .andWhere('user.role = :role', { role: UserRole.PROFESSIONAL })
      .select([
        'user.id',
        'user.createdAt',
        'user.email',
        'user.active',
        'user.role',
        'professional.id',
        'professional.name',
        'professional.speciality',
        'professional.type',
      ])
      .getOne();
  }

  findPatientById(id: string) {
    return this.createQueryBuilder('user')
      .leftJoin('user.patient', 'patient')
      .where('user.id = :id', { id })
      .andWhere('user.role = :role', { role: UserRole.PATIENT })
      .select([
        'user.id',
        'user.createdAt',
        'user.email',
        'user.active',
        'user.role',
        'patient.id',
        'patient.cpf',
        'patient.name',
        'patient.birthDate',
        'patient.contact',
      ])
      .getOne();
  }
}
