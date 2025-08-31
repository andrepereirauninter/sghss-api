import request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { ProfessionalType } from '../../../apps/users/enums/professional-type.enum';
import { UserRole } from '../../../apps/users/enums/user-role.enum';
import { CreateUserPayload } from '../../../apps/users/payload/create-user.payload';
import { UserRepository } from '../../../apps/users/repositories/user.repository';
import { createAdministratorMock } from '../../mocks/users/create-administrator.mock';
import { createPatientMock } from '../../mocks/users/create-patient.mock';
import { createProfessionalMock } from '../../mocks/users/create-professional.mock';
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
        password: 'Anypassword@123',
        active: true,
        role: UserRole.ADMIN,
        administrator: {
          name: 'any_name',
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
        },
      });

      expect(responseInDb?.comparePassword(payload.password)).toBe(true);
    });

    it('should not create an administrador with duplicated email', async () => {
      const { user: existingUser } = await createAdministratorMock({
        app,
        email: 'any_email@email.com',
      });

      const payload: CreateUserPayload = {
        email: existingUser.email,
        active: true,
        role: UserRole.ADMIN,
        password: 'Anypassword@123',
        administrator: {
          name: 'any_name',
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        error: 'Conflict',
        message: `Um usuário com o email ${payload.email} já existe.`,
        statusCode: HttpStatus.CONFLICT,
      });
    });

    it('should create a patient', async () => {
      const payload: CreateUserPayload = {
        email: 'any_email@email.com',
        password: 'Anypassword@123',
        active: true,
        role: UserRole.PATIENT,
        patient: {
          name: 'any_name',
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
          cpf: payload.patient?.cpf,
          birthDate: payload.patient?.birthDate,
          contact: payload.patient?.contact,
        },
      });

      expect(responseInDb?.comparePassword(payload.password)).toBe(true);
    });

    it('should not create an patient with duplicated email', async () => {
      const { user: existingUser } = await createPatientMock({
        app,
        email: 'any_email@email.com',
        cpf: 'any_cpf',
      });

      const payload: CreateUserPayload = {
        email: existingUser.email,
        password: 'Anypassword@123',
        active: true,
        role: UserRole.PATIENT,
        patient: {
          name: 'any_name',
          cpf: 'other_cpf',
          birthDate: 'any_birthDate',
          contact: 'any_contact',
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        error: 'Conflict',
        message: `Um usuário com o email ${payload.email} já existe.`,
        statusCode: HttpStatus.CONFLICT,
      });
    });

    it('should not create an patient with duplicated cpf', async () => {
      const { user: existingUser } = await createPatientMock({
        app,
        email: 'any_email@email.com',
        cpf: 'any_cpf',
      });

      const payload: CreateUserPayload = {
        email: 'other_email@email.com',
        password: 'Anypassword@123',
        active: true,
        role: UserRole.PATIENT,
        patient: {
          name: 'any_name',
          cpf: existingUser.patient.cpf,
          birthDate: 'any_birthDate',
          contact: 'any_contact',
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        error: 'Conflict',
        message: `Um usuário com o cpf ${payload.patient?.cpf} já existe.`,
        statusCode: HttpStatus.CONFLICT,
      });
    });

    it('should create a professional', async () => {
      const payload: CreateUserPayload = {
        email: 'any_email@email.com',
        password: 'Anypassword@123',
        active: true,
        role: UserRole.PROFESSIONAL,
        professional: {
          name: 'any_name',
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
          type: payload.professional?.type,
          speciality: payload.professional?.speciality,
        },
      });

      expect(responseInDb?.comparePassword(payload.password)).toBe(true);
    });

    it('should not create an professional with duplicated email', async () => {
      const { user: existingUser } = await createProfessionalMock({
        app,
        email: 'any_email@email.com',
      });

      const payload: CreateUserPayload = {
        email: existingUser.email,
        password: 'Anypassword@123',
        active: true,
        role: UserRole.PROFESSIONAL,
        professional: {
          name: 'any_name',
          type: ProfessionalType.MEDIC,
          speciality: 'any_speciality',
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        error: 'Conflict',
        message: `Um usuário com o email ${payload.email} já existe.`,
        statusCode: HttpStatus.CONFLICT,
      });
    });
  });
});
