import { INestApplication } from '@nestjs/common';

import { UserRole } from '../../../apps/users/enums/user-role.enum';
import { UserRepository } from '../../../apps/users/repositories/user.repository';

export async function createPatientMock({
  app,
  email,
  active = true,
  name = 'any_name',
  password,
  cpf,
}: {
  app: INestApplication;
  email: string;
  active?: boolean;
  password?: string;
  name?: string;
  cpf: string;
}) {
  const plainPassword = password ?? 'Anypassword@123';

  const repository = app.get(UserRepository);

  const user = repository.create({
    email,
    active,
    role: UserRole.PATIENT,
    password: plainPassword,
    patient: {
      name,
      cpf,
      birthDate: '2025-01-01',
      contact: 'any_contact',
    },
  });

  return {
    user: await repository.save(user),
    plainPassword,
  };
}
