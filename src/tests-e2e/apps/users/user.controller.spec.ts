import { randomUUID } from 'node:crypto';
import request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { ProfessionalType } from '../../../apps/users/enums/professional-type.enum';
import { UserRole } from '../../../apps/users/enums/user-role.enum';
import { CreateUserPayload } from '../../../apps/users/payload/create-user.payload';
import { FilterAllUsersPayload } from '../../../apps/users/payload/filter-all-users.payload';
import { UpdateAdministratorPayload } from '../../../apps/users/payload/update-administrator.payload';
import { UpdatePasswordPayload } from '../../../apps/users/payload/update-password.payload';
import { UpdatePatientPayload } from '../../../apps/users/payload/update-patient.payload';
import { UpdateProfissionalPayload } from '../../../apps/users/payload/update-profissional.payload';
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
        acceptedTerms: true,
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
        acceptedTerms: true,
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
        acceptedTerms: true,
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
        acceptedTerms: true,
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
        acceptedTerms: true,
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
        acceptedTerms: true,
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
        acceptedTerms: true,
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

    it('should not get details of a user if it does not exist', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `O usuário com ID ${id} não foi encontrado.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('/users/:id/activate (POST)', () => {
    it(`should activate a user`, async () => {
      const { user: administrator } = await createAdministratorMock({
        app,
        email: 'admin@email.com',
        active: false,
      });

      const response = await request(app.getHttpServer())
        .post(`/users/${administrator.id}/activate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: administrator.id,
        },
      });

      expect(responseInDb?.active).toBe(true);
    });

    it('should do nothing if the user already is active', async () => {
      const { user: administrator } = await createAdministratorMock({
        app,
        email: 'admin@email.com',
        active: true,
      });

      const response = await request(app.getHttpServer())
        .post(`/users/${administrator.id}/activate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: administrator.id,
        },
      });

      expect(responseInDb?.active).toBe(true);
    });

    it('should not activate a user if it does not exist', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .post(`/users/${id}/activate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `O usuário com ID ${id} não foi encontrado.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('/users/:id/deactivate (POST)', () => {
    it(`should deactivate a user`, async () => {
      const { user: administrator } = await createAdministratorMock({
        app,
        email: 'admin@email.com',
        active: true,
      });

      const response = await request(app.getHttpServer())
        .post(`/users/${administrator.id}/deactivate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: administrator.id,
        },
      });

      expect(responseInDb?.active).toBe(false);
    });

    it('should do nothing if the user already is inactive', async () => {
      const { user: administrator } = await createAdministratorMock({
        app,
        email: 'admin@email.com',
        active: false,
      });

      const response = await request(app.getHttpServer())
        .post(`/users/${administrator.id}/deactivate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: administrator.id,
        },
      });

      expect(responseInDb?.active).toBe(false);
    });

    it('should not deactivate a user if it does not exist', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .post(`/users/${id}/deactivate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `O usuário com ID ${id} não foi encontrado.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update an administrator', async () => {
      const { user: administrator } = await createAdministratorMock({
        app,
        email: 'admin@email.com',
        name: 'any_name',
      });

      const payload: UpdateAdministratorPayload = {
        email: 'updated_admin@email.com',
        name: 'updated_name',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/administrator/${administrator.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: administrator.id,
        },
        relations: {
          administrator: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: administrator.id,
        email: payload.email,
        active: administrator.active,
        role: administrator.role,
        administrator: {
          id: administrator.administrator.id,
          name: payload.name,
        },
      });
    });

    it('should update a professional', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'professional@email.com',
        name: 'any_name',
      });

      const payload: UpdateProfissionalPayload = {
        email: 'updated_professional@email.com',
        name: 'updated_name',
        type: ProfessionalType.NURSE,
        speciality: 'updated_speciality',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/professional/${professional.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: professional.id,
        },
        relations: {
          professional: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: professional.id,
        email: payload.email,
        active: professional.active,
        role: professional.role,
        professional: {
          id: professional.professional.id,
          name: payload.name,
          speciality: payload.speciality,
          type: payload.type,
        },
      });
    });

    it('should update a patient', async () => {
      const { user: patient } = await createPatientMock({
        app,
        email: 'patient@email.com',
        name: 'any_name',
        cpf: 'any_cpf',
      });

      const payload: UpdatePatientPayload = {
        email: 'updated_patient@email.com',
        name: 'updated_name',
        cpf: 'updated_cpf',
        birthDate: '2025-01-01',
        contact: 'updated_contact',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/patient/${patient.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: patient.id,
        },
        relations: {
          patient: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: patient.id,
        email: payload.email,
        active: patient.active,
        role: patient.role,
        patient: {
          id: patient.patient.id,
          name: payload.name,
          cpf: payload.cpf,
          birthDate: payload.birthDate,
        },
      });
    });

    it('should not update an administrator with a duplicate email', async () => {
      const { user: existingProfessional } = await createAdministratorMock({
        app,
        email: 'existing_admin@email.com',
        name: 'any_name',
      });

      const { user: administratorToUpdate } = await createAdministratorMock({
        app,
        email: 'admin_to_update@email.com',
        name: 'any_name',
      });

      const payload: UpdateAdministratorPayload = {
        email: existingProfessional.email,
        name: 'updated_name',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/administrator/${administratorToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
        message: `Um usuário com o email ${payload.email} já existe.`,
      });
    });

    it('should not update a professional with a duplicate email', async () => {
      const { user: existingProfessional } = await createProfessionalMock({
        app,
        email: 'existing_professional@email.com',
        name: 'existing_name',
      });

      const { user: professionalToUpdate } = await createProfessionalMock({
        app,
        email: 'professional_to_update@email.com',
        name: 'any_name',
      });

      const payload: UpdateProfissionalPayload = {
        email: existingProfessional.email,
        name: 'updated_name',
        type: ProfessionalType.NURSE,
        speciality: 'updated_speciality',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/professional/${professionalToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
        message: `O profissional de saúde com o email ${payload.email} já existe.`,
      });
    });

    it('should not update a patient with a duplicate email', async () => {
      const { user: existingPatient } = await createPatientMock({
        app,
        email: 'existing_patient@email.com',
        name: 'any_name',
        cpf: 'existing_cpf',
      });

      const { user: patientToUpdate } = await createPatientMock({
        app,
        email: 'patient_to_update@email.com',
        name: 'any_name',
        cpf: 'any_cpf',
      });

      const payload: UpdatePatientPayload = {
        email: existingPatient.email,
        name: 'updated_name',
        cpf: 'updated_cpf',
        birthDate: '2025-01-01',
        contact: 'updated_contact',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/patient/${patientToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
        message: `O paciente com o email ${payload.email} já existe.`,
      });
    });

    it('should not update a patient with a duplicate cpf', async () => {
      const { user: existingPatient } = await createPatientMock({
        app,
        email: 'existing_patient@email.com',
        name: 'any_name',
        cpf: 'existing_cpf',
      });

      const { user: patientToUpdate } = await createPatientMock({
        app,
        email: 'patient_to_update@email.com',
        name: 'any_name',
        cpf: 'any_cpf',
      });

      const payload: UpdatePatientPayload = {
        email: 'updated_email@email.com',
        name: 'updated_name',
        cpf: existingPatient.patient.cpf,
        birthDate: '2025-01-01',
        contact: 'updated_contact',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/patient/${patientToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
        message: `O paciente com o cpf ${payload.cpf} já existe.`,
      });
    });

    it('should not update a administrator if it does not exist', async () => {
      const id = randomUUID();

      const payload: UpdateAdministratorPayload = {
        email: 'any_email@email.com',
        name: 'any_name',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/administrator/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `O administrador com ID ${id} não foi encontrado.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });

    it('should not update a professional if it does not exist', async () => {
      const id = randomUUID();

      const payload: UpdateProfissionalPayload = {
        email: 'any_email@email.com',
        name: 'any_name',
        type: ProfessionalType.MEDIC,
        speciality: 'any_speciality',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/professional/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `O profissional de saúde com ID ${id} não foi encontrado.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });

    it('should not update a patient if it does not exist', async () => {
      const id = randomUUID();

      const payload: UpdatePatientPayload = {
        email: 'any_email@email.com',
        name: 'any_name',
        cpf: 'any_cpf',
        birthDate: '2025-01-01',
        contact: 'any_contact',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/patient/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `O paciente com ID ${id} não foi encontrado.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('/users/:id/password (PATCH)', () => {
    it('should update password', async () => {
      const { user, plainPassword } = await createAdministratorMock({
        app,
        email: 'any_email@email.com',
      });

      const payload: UpdatePasswordPayload = {
        oldPassword: plainPassword,
        newPassword: 'any_new_password',
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${user.id}/password`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          password: true,
        },
      });

      expect(responseInDb?.comparePassword(plainPassword)).toBe(false);
      expect(responseInDb?.comparePassword(payload.newPassword)).toBe(true);
    });

    it('should not update password if the user is not found', async () => {
      const id = randomUUID();

      const payload: UpdatePasswordPayload = {
        oldPassword: 'any_old_password',
        newPassword: 'any_new_password',
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${id}/password`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        message: `O usuário com ID ${id} não foi encontrado.`,
      });
    });

    it('should not update password if the old password is invalid', async () => {
      const { user } = await createAdministratorMock({
        app,
        email: 'any_email@email.com',
      });

      const payload: UpdatePasswordPayload = {
        oldPassword: 'invalid_old_password',
        newPassword: 'any_new_password',
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${user.id}/password`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
        message: `A senha antiga está incorreta.`,
      });
    });
  });

  describe('/users/:id (DELETE)', () => {
    it(`should delete a administrator`, async () => {
      const { user: administrator } = await createAdministratorMock({
        app,
        email: 'admin@email.com',
        active: true,
      });

      const response = await request(app.getHttpServer())
        .delete(`/users/${administrator.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: administrator.id,
        },
      });

      expect(responseInDb).toBeNull();
    });

    it(`should delete a professional`, async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'admin@email.com',
      });

      const response = await request(app.getHttpServer())
        .delete(`/users/${professional.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: professional.id,
        },
      });

      expect(responseInDb).toBeNull();
    });

    it(`should delete a patient`, async () => {
      const { user: patient } = await createPatientMock({
        app,
        email: 'admin@email.com',
        cpf: 'any_cpf',
      });

      const response = await request(app.getHttpServer())
        .delete(`/users/${patient.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: patient.id,
        },
      });

      expect(responseInDb).toBeNull();
    });

    it('should not delete a user if it does not exist', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `O usuário com ID ${id} não foi encontrado.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });
});
