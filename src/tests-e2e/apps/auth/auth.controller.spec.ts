import request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { LoginPayload } from '../../../apps/auth/payload/login.payload';
import { UserRole } from '../../../apps/users/enums/user-role.enum';
import { createAdministratorMock } from '../../mocks/users/create-administrator.mock';
import { createPatientMock } from '../../mocks/users/create-patient.mock';
import { createProfessionalMock } from '../../mocks/users/create-professional.mock';
import {
  generateDefaultAppAfterEachSetup,
  generateDefaultAppBeforeEachSetup,
} from '../../utils/setup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    ({ app } = await generateDefaultAppBeforeEachSetup());
  });

  afterEach(async () => {
    await generateDefaultAppAfterEachSetup(app);
  });

  describe('/login (POST)', () => {
    it('should login with as admin', async () => {
      const { user, plainPassword } = await createAdministratorMock({
        app,
        email: 'any_email@email.com',
        active: true,
        name: 'any_name',
      });

      const payload: LoginPayload = {
        email: user.email,
        password: plainPassword,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(payload);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        token: expect.any(String),
        user: {
          id: user.id,
          email: user.email,
          active: user.active,
          role: user.role,
          administrator: {
            id: user.administrator.id,
            name: user.administrator.name,
          },
        },
      });
    });

    it('should login with as professional', async () => {
      const { user, plainPassword } = await createProfessionalMock({
        app,
        email: 'any_email@email.com',
        active: true,
        name: 'any_name',
      });

      const payload: LoginPayload = {
        email: user.email,
        password: plainPassword,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(payload);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        token: expect.any(String),
        user: {
          id: user.id,
          email: user.email,
          active: user.active,
          role: user.role,
          professional: {
            id: user.professional.id,
            name: user.professional.name,
            speciality: user.professional.speciality,
            type: user.professional.type,
          },
        },
      });
    });

    it('should login with as patient', async () => {
      const { user, plainPassword } = await createPatientMock({
        app,
        email: 'any_email@email.com',
        active: true,
        name: 'any_name',
        cpf: 'any_cpf',
      });

      const payload: LoginPayload = {
        email: user.email,
        password: plainPassword,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(payload);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        token: expect.any(String),
        user: {
          id: user.id,
          email: user.email,
          active: true,
          role: UserRole.PATIENT,
          patient: {
            id: user.patient.id,
            name: user.patient.name,
            cpf: user.patient.cpf,
            birthDate: user.patient.birthDate,
            contact: user.patient.contact,
          },
        },
      });
    });
  });
});
