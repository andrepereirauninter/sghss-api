import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { paginate } from '../../../common/helpers/paginate.helper';
import { BaseRepository } from '../../../common/repositories/base-repository';
import { Unit } from '../entities/unit.entity';
import { FilterAllUnitsPayload } from '../payload/filter-all-units.payload';
import { FilterSearchUnitsPayload } from '../payload/filter-search-units.payload';

@Injectable()
export class UnitRepository extends BaseRepository<Unit> {
  constructor(
    @InjectRepository(Unit)
    repository: BaseRepository<Unit>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findAll(payload: FilterAllUnitsPayload) {
    const {
      page = 1,
      limit = 10,
      code = '',
      name = '',
      address = '',
      active,
      type,
      professionalName = '',
    } = payload;

    const query = this.createQueryBuilder('unit')
      .leftJoin('unit.professional', 'professional')
      .where('unit.code ILIKE :code', { code: `%${code}%` })
      .andWhere('unit.name ILIKE :name', { name: `%${name}%` })
      .andWhere('unit.address ILIKE :address', { address: `%${address}%` })
      .andWhere('professional.name ILIKE :name', {
        name: `%${professionalName}%`,
      });

    if (active) {
      query.andWhere('unit.active = :active', { active });
    }

    if (type?.length) {
      query.andWhere('unit.type IN (:...type)', { type });
    }

    query
      .select([
        'unit.id',
        'unit.code',
        'unit.name',
        'unit.address',
        'unit.active',
        'unit.type',
        'professional.id',
        'professional.name',
      ])
      .orderBy('unit.createdAt', 'DESC');

    return paginate(query, page, limit);
  }

  findDetails(id: string) {
    return this.createQueryBuilder('unit')
      .leftJoin('unit.professional', 'professional')
      .where('unit.id = :id', { id })
      .select([
        'unit.id',
        'unit.code',
        'unit.name',
        'unit.address',
        'unit.active',
        'unit.type',
        'professional.id',
        'professional.name',
      ])
      .getOne();
  }

  search(payload: FilterSearchUnitsPayload) {
    const { name = '', code = '' } = payload;

    return this.createQueryBuilder('unit')
      .where('unit.name ILIKE :name', { name: `%${name}%` })
      .orWhere('unit.code ILIKE :code', { code: `%${code}%` })
      .select(['unit.id', 'unit.code', 'unit.name'])
      .orderBy('unit.createdAt', 'DESC')
      .getMany();
  }
}
