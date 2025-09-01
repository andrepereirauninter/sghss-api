import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProfessionalService } from '../users/professional.service';
import { CreateUnitPayload } from './payload/create-unit.payload';
import { FilterAllUnitsPayload } from './payload/filter-all-units.payload';
import { FilterSearchUnitsPayload } from './payload/filter-search-units.payload';
import { UpdateUnitPayload } from './payload/update-unit.payload';
import { UnitRepository } from './repositories/unit.repository';

@Injectable()
export class UnitService {
  constructor(
    private readonly repository: UnitRepository,
    private readonly professionalService: ProfessionalService,
  ) {}

  findAll(payload: FilterAllUnitsPayload) {
    return this.repository.findAll(payload);
  }

  search(payload: FilterSearchUnitsPayload) {
    return this.repository.search(payload);
  }

  async create(payload: CreateUnitPayload) {
    const existingUnit = await this.repository.findOneBy({
      code: payload.code,
    });

    if (existingUnit) {
      throw new ConflictException(
        `Uma unidade com o código ${payload.code} já existe.`,
      );
    }

    const professionals = await this.professionalService.findByIds(
      payload.professionals,
    );

    if (professionals?.length !== payload.professionals?.length) {
      const missingProfessionals = payload.professionals.filter(
        (professionalId) =>
          !professionals.find(
            (professional) => professional.id === professionalId,
          ),
      );
      throw new NotFoundException(
        `Alguns profissionais de saúde não foram encontrados com os IDs: ${missingProfessionals.join(', ')}.`,
      );
    }

    await this.repository.save({
      ...payload,
      professionals,
    });
  }

  async findDetails(id: string) {
    const unit = await this.repository.findDetails(id);

    if (!unit) {
      throw new NotFoundException(`Unidade com ID ${id} não foi encontrada.`);
    }

    return unit;
  }

  async activate(id: string) {
    const unit = await this.repository.findOneBy({ id });

    if (!unit) {
      throw new NotFoundException(`Unidade com ID ${id} não foi encontrada.`);
    }

    unit.active = true;
    await this.repository.save(unit);
  }

  async deactivate(id: string) {
    const unit = await this.repository.findOneBy({ id });

    if (!unit) {
      throw new NotFoundException(`Unidade com ID ${id} não foi encontrada.`);
    }

    unit.active = false;
    await this.repository.save(unit);
  }

  async update(id: string, payload: UpdateUnitPayload) {
    const unit = await this.repository.findOneBy({ id });

    if (!unit) {
      throw new NotFoundException(`Unidade com ID ${id} não foi encontrada.`);
    }

    const unitWithSameCode = await this.repository.findOneBy({
      code: payload.code,
    });

    if (unitWithSameCode && unitWithSameCode.id !== id) {
      throw new ConflictException(
        `Uma unidade com o código ${payload.code} já existe.`,
      );
    }

    const professionals = await this.professionalService.findByIds(
      payload.professionals,
    );

    if (professionals?.length !== payload.professionals?.length) {
      const missingProfessionals = payload.professionals.filter(
        (professionalId) =>
          !professionals.find(
            (professional) => professional.id === professionalId,
          ),
      );
      throw new NotFoundException(
        `Alguns profissionais de saúde não foram encontrados com os IDs: ${missingProfessionals.join(', ')}.`,
      );
    }

    await this.repository.save({
      ...unit,
      ...payload,
      professionals,
    });
  }

  async remove(id: string) {
    const unit = await this.repository.findOneBy({ id });

    if (!unit) {
      throw new NotFoundException(`Unidade com ID ${id} não foi encontrada.`);
    }

    await this.repository.delete(id);
  }
}
