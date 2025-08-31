import { INestApplication } from '@nestjs/common';

import { ProfessionalType } from '../../../apps/users/enums/professional-type.enum';
import { UserRole } from '../../../apps/users/enums/user-role.enum';
import { UserRepository } from '../../../apps/users/repositories/user.repository';

export async function createProfessionalMock({
  app,
  email,
  active = true,
  name = 'any_name',
  password,
}: {
  app: INestApplication;
  email: string;
  active?: boolean;
  password?: string;
  name?: string;
}) {
  const plainPassword = password ?? 'Anypassword@123';

  const repository = app.get(UserRepository);

  const user = repository.create({
    email,
    active,
    role: UserRole.PROFESSIONAL,
    password: plainPassword,
    professional: {
      name,
      speciality: 'any_speciality',
      type: ProfessionalType.MEDIC,
    },
  });

  return {
    user: await repository.save(user),
    plainPassword,
  };
}
