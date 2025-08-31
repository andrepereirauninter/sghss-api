import request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { ProfessionalType } from '../../../apps/users/enums/professional-type.enum';
import { UserRole } from '../../../apps/users/enums/user-role.enum';
import { CreateUserPayload } from '../../../apps/users/payload/create-user.payload';
import { UserRepository } from '../../../apps/users/repositories/user.repository';
import {
  generateDefaultAppAfterEachSetup,
  generateDefaultAppBeforeEachSetup,
} from '../../utils/setup';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let repository: UserRepository;

  beforeEach(async () => {
    ({ app } = await generateDefaultAppBeforeEachSetup());

    repository = app.get(UserRepository);
  });

  afterEach(async () => {
    await generateDefaultAppAfterEachSetup(app);
  });

  describe('/users (POST)', () => {
    it('should create an administrator', async () => {
      const payload: CreateUserPayload = {
        email: 'any_email@email.com',
        password: 'any_password',
        active: true,
        role: UserRole.ADMIN,
        administrator: {
          name: 'any_name',
          active: true,
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CREATED);

      const responseInDb = await repository.findOne({
        where: {
          email: payload.email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          active: true,
          role: true,
          administrator: {
            id: true,
            name: true,
          },
        },
        relations: {
          administrator: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: expect.any(String),
        email: payload.email,
        active: payload.active,
        role: payload.role,
        administrator: {
          id: expect.any(String),
          name: payload.administrator?.name,
          active: payload.administrator?.active,
        },
      });

      expect(responseInDb?.comparePassword(payload.password)).toBe(true);
    });

    it('should create a patient', async () => {
      const payload: CreateUserPayload = {
        email: 'any_email@email.com',
        password: 'any_password',
        active: true,
        role: UserRole.PATIENT,
        patient: {
          name: 'any_name',
          active: true,
          cpf: 'any_cpf',
          birthDate: 'any_birthDate',
          contact: 'any_contact',
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CREATED);

      const responseInDb = await repository.findOne({
        where: {
          email: payload.email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          active: true,
          role: true,
          patient: {
            id: true,
            name: true,
            cpf: true,
            birthDate: true,
            contact: true,
          },
        },
        relations: {
          patient: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: expect.any(String),
        email: payload.email,
        active: payload.active,
        role: payload.role,
        patient: {
          id: expect.any(String),
          name: payload.patient?.name,
          active: payload.patient?.active,
          cpf: payload.patient?.cpf,
          birthDate: payload.patient?.birthDate,
          contact: payload.patient?.contact,
        },
      });

      expect(responseInDb?.comparePassword(payload.password)).toBe(true);
    });

    it('should create a professional', async () => {
      const payload: CreateUserPayload = {
        email: 'any_email@email.com',
        password: 'any_password',
        active: true,
        role: UserRole.PROFESSIONAL,
        professional: {
          name: 'any_name',
          active: true,
          type: ProfessionalType.MEDIC,
          speciality: 'any_speciality',
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CREATED);

      const responseInDb = await repository.findOne({
        where: {
          email: payload.email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          active: true,
          role: true,
          professional: {
            id: true,
            name: true,
            type: true,
            speciality: true,
          },
        },
        relations: {
          professional: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: expect.any(String),
        email: payload.email,
        active: payload.active,
        role: payload.role,
        professional: {
          id: expect.any(String),
          name: payload.professional?.name,
          active: payload.professional?.active,
          type: payload.professional?.type,
          speciality: payload.professional?.speciality,
        },
      });

      expect(responseInDb?.comparePassword(payload.password)).toBe(true);
    });
  });
});
