import request from 'supertest';

import { INestApplication } from '@nestjs/common';

import { LoginPayload } from '../../../apps/auth/payload/login.payload';
import { User } from '../../../apps/users/entities/user.entity';
import { UserRole } from '../../../apps/users/enums/user-role.enum';
import { createAdministratorMock } from '../users/create-administrator.mock';
import { createPatientMock } from '../users/create-patient.mock';
import { createProfessionalMock } from '../users/create-professional.mock';

export async function loginMock(
  app: INestApplication,
  payload?: LoginPayload,
  userRole: UserRole = UserRole.ADMIN,
) {
  let user: User | undefined;

  if (!payload) {
    const plainPassword = 'Any_password123';

    switch (userRole) {
      case UserRole.ADMIN:
        ({ user } = await createAdministratorMock({
          app,
          email: 'mock_email@email.com',
          password: plainPassword,
        }));

        payload = {
          email: user?.email,
          password: plainPassword,
        };
        break;
      case UserRole.PROFESSIONAL:
        ({ user } = await createProfessionalMock({
          app,
          email: 'mock_email@email.com',
          password: plainPassword,
        }));

        payload = {
          email: user.email,
          password: plainPassword,
        };
        break;
      case UserRole.PATIENT:
        ({ user } = await createPatientMock({
          app,
          email: 'mock_email@email.com',
          password: plainPassword,
          cpf: 'any_cpf',
        }));

        payload = {
          email: user.email,
          password: plainPassword,
        };
        break;
    }
  }

  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(payload);

  return {
    response,
    user,
  };
}
