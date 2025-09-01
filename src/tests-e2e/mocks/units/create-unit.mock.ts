import { INestApplication } from '@nestjs/common';

import { UnitRepository } from '../../../apps/units/repositories/unit.repository';
import { Professional } from '../../../apps/users/entities/professional.entity';
import { UnitType } from '../../../apps/users/enums/unit-type.enum';

export function createUnitMock({
  app,
  code,
  name,
  active = true,
  professionals,
}: {
  app: INestApplication;
  code: string;
  name: string;
  active?: boolean;
  professionals: Professional[];
}) {
  const repository = app.get(UnitRepository);

  const unit = repository.create({
    code,
    name,
    address: 'any_address',
    type: UnitType.HOSPITAL,
    active,
    professionals,
  });

  return repository.save(unit);
}
