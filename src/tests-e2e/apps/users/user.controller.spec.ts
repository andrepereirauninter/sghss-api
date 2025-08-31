import request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { ProfessionalType } from '../../../apps/users/enums/professional-type.enum';
import { UserRole } from '../../../apps/users/enums/user-role.enum';
import { CreateUserPayload } from '../../../apps/users/payload/create-user.payload';
import { FilterAllUsersPayload } from '../../../apps/users/payload/filter-all-users.payload';
import { UserRepository } from '../../../apps/users/repositories/user.repository';
import { loginMock } from '../../mocks/auth/login.mock';
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
  let loginResponse: request.Response;

  beforeEach(async () => {
    ({ app } = await generateDefaultAppBeforeEachSetup());
    ({ response: loginResponse } = await loginMock(app));

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
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
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
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
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
          birthDate: '2025-01-01',
          contact: 'any_contact',
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
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
          birthDate: '2025-01-01',
          contact: 'any_contact',
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
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
          birthDate: '2025-01-01',
          contact: 'any_contact',
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
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
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
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
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        error: 'Conflict',
        message: `Um usuário com o email ${payload.email} já existe.`,
        statusCode: HttpStatus.CONFLICT,
      });
    });
  });

  describe('/users (GET)', () => {
    it('should list users', async () => {
      const { user: administrator } = await createAdministratorMock({
        app,
        email: 'admin@email.com',
        name: 'admin',
      });

      const { user: professional } = await createProfessionalMock({
        app,
        email: 'professional@email.com',
        name: 'professional',
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient@email.com',
        name: 'patient',
        cpf: 'any_cpf',
      });

      const response = await request(app.getHttpServer())
        .get(`/users`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body).toMatchObject({
        data: [
          {
            id: patient.id,
            email: patient.email,
            active: patient.active,
            role: patient.role,
            patient: {
              id: patient.patient.id,
              name: patient.patient.name,
            },
          },
          {
            id: professional.id,
            email: professional.email,
            active: professional.active,
            role: professional.role,
            professional: {
              id: professional.professional.id,
              name: professional.professional.name,
            },
          },
          {
            id: administrator.id,
            email: administrator.email,
            active: administrator.active,
            role: administrator.role,
            administrator: {
              id: administrator.administrator.id,
              name: administrator.administrator.name,
            },
          },
          {
            id: loginResponse.body.user.id,
            email: loginResponse.body.user.email,
            active: loginResponse.body.user.active,
            role: loginResponse.body.user.role,
            administrator: {
              id: loginResponse.body.user.administrator.id,
              name: loginResponse.body.user.administrator.name,
            },
          },
        ],
        pagination: {
          currentPage: 1,
          limitPerPage: 10,
          totalItems: 4,
          previousPage: null,
          nextPage: null,
        },
      });
    });

    it('should paginate users', async () => {
      await createAdministratorMock({
        app,
        email: 'admin@email.com',
        name: 'admin',
      });

      const { user: professional } = await createProfessionalMock({
        app,
        email: 'professional@email.com',
        name: 'professional',
      });

      await createPatientMock({
        app,
        email: 'patient@email.com',
        name: 'patient',
        cpf: 'any_cpf',
      });

      const payload: FilterAllUsersPayload = {
        page: 2,
        limit: 1,
      };

      const response = await request(app.getHttpServer())
        .get(`/users`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .query(payload)
        .send();

      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body).toMatchObject({
        data: [
          {
            id: professional.id,
            email: professional.email,
            active: professional.active,
            role: professional.role,
            professional: {
              id: professional.professional.id,
              name: professional.professional.name,
            },
          },
        ],
        pagination: {
          currentPage: 2,
          limitPerPage: 1,
          totalItems: 4,
          previousPage: 1,
          nextPage: 3,
        },
      });
    });

    it('should filter users', async () => {
      await createAdministratorMock({
        app,
        email: 'admin@email.com',
        name: 'admin',
      });

      await createProfessionalMock({
        app,
        email: 'professional@email.com',
        name: 'professional',
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient@email.com',
        name: 'patient',
        cpf: 'any_cpf',
      });

      const payload: FilterAllUsersPayload = {
        email: patient.email,
        active: patient.active,
        role: [patient.role],
        name: patient.patient.name,
      };

      const response = await request(app.getHttpServer())
        .get(`/users`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .query(payload)
        .send();

      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body).toMatchObject({
        data: [
          {
            id: patient.id,
            email: patient.email,
            active: patient.active,
            role: patient.role,
            patient: {
              id: patient.patient.id,
              name: patient.patient.name,
            },
          },
        ],
        pagination: {
          currentPage: 1,
          limitPerPage: 10,
          totalItems: 1,
          previousPage: null,
          nextPage: null,
        },
      });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should get details of an administrator', async () => {
      const { user: administrator } = await createAdministratorMock({
        app,
        email: 'admin@email.com',
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${administrator.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: administrator.id,
        email: administrator.email,
        active: administrator.active,
        role: administrator.role,
        administrator: {
          id: administrator.administrator.id,
          name: administrator.administrator.name,
        },
      });
    });

    it('should get details of a professional', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'professional@email.com',
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${professional.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: professional.id,
        email: professional.email,
        active: professional.active,
        role: professional.role,
        professional: {
          id: professional.professional.id,
          name: professional.professional.name,
          speciality: professional.professional.speciality,
          type: professional.professional.type,
        },
      });
    });

    it('should get details of a patient', async () => {
      const { user: patient } = await createPatientMock({
        app,
        email: 'patient@email.com',
        cpf: 'any_cpf',
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${patient.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: patient.id,
        email: patient.email,
        active: patient.active,
        role: patient.role,
        patient: {
          id: patient.patient.id,
          name: patient.patient.name,
          cpf: patient.patient.cpf,
          birthDate: patient.patient.birthDate,
          contact: patient.patient.contact,
        },
      });
    });
  });
});
