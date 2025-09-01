import { randomUUID } from 'node:crypto';
import request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { AppointmentType } from '../../../apps/appointments/enums/appointment-type.enum';
import { CreateAppointmentPayload } from '../../../apps/appointments/payload/create-appointment.payload';
import { FilterAllAppointmentsPayload } from '../../../apps/appointments/payload/filter-all-appointments.payload';
import { UpdateAppointmentPayload } from '../../../apps/appointments/payload/update-appointment.payload';
import { AppointmentRepository } from '../../../apps/appointments/repositories/appointment.repository';
import { ProfessionalType } from '../../../apps/users/enums/professional-type.enum';
import { createAppointmentMock } from '../../mocks/appointments/create-appointment.mock';
import { loginMock } from '../../mocks/auth/login.mock';
import { createUnitMock } from '../../mocks/units/create-unit.mock';
import { createPatientMock } from '../../mocks/users/create-patient.mock';
import { createProfessionalMock } from '../../mocks/users/create-professional.mock';
import {
  generateDefaultAppAfterEachSetup,
  generateDefaultAppBeforeEachSetup,
} from '../../utils/setup';

describe('AppointmentsController (e2e)', () => {
  let app: INestApplication;
  let repository: AppointmentRepository;
  let loginResponse: request.Response;

  beforeEach(async () => {
    ({ app } = await generateDefaultAppBeforeEachSetup());

    const { user: professionalToLogin, plainPassword } =
      await createProfessionalMock({
        app,
        email: 'professional@email.com',
        name: 'professional',
      });

    ({ response: loginResponse } = await loginMock(app, {
      email: professionalToLogin.email,
      password: plainPassword,
    }));

    repository = app.get(AppointmentRepository);
  });

  afterEach(async () => {
    await generateDefaultAppAfterEachSetup(app);
  });

  describe('/appointments (GET)', () => {
    it('should list appointments', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const firstAppointment = await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      const secondAppointment = await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      const response = await request(app.getHttpServer())
        .get(`/appointments`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        data: [
          {
            id: secondAppointment.id,
            date: secondAppointment.date.toISOString(),
            notes: secondAppointment.notes,
            medic: {
              id: professional.professional.id,
              name: professional.professional.name,
            },
            patient: {
              id: patient.patient.id,
              name: patient.patient.name,
            },
            unit: {
              id: unit.id,
              name: unit.name,
            },
          },
          {
            id: firstAppointment.id,
            date: firstAppointment.date.toISOString(),
            notes: firstAppointment.notes,
            medic: {
              id: professional.professional.id,
              name: professional.professional.name,
            },
            patient: {
              id: patient.patient.id,
              name: patient.patient.name,
            },
            unit: {
              id: unit.id,
              name: unit.name,
            },
          },
        ],
        pagination: {
          currentPage: 1,
          limitPerPage: 10,
          totalItems: 2,
          previousPage: null,
          nextPage: null,
        },
      });
    });

    it('should paginate appointments', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const firstAppointment = await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      const payload: FilterAllAppointmentsPayload = {
        page: 2,
        limit: 1,
      };

      const response = await request(app.getHttpServer())
        .get(`/appointments`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .query(payload)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        data: [
          {
            id: firstAppointment.id,
            date: firstAppointment.date.toISOString(),
            notes: firstAppointment.notes,
            medic: {
              id: professional.professional.id,
              name: professional.professional.name,
            },
            patient: {
              id: patient.patient.id,
              name: patient.patient.name,
            },
            unit: {
              id: unit.id,
              name: unit.name,
            },
          },
        ],
        pagination: {
          currentPage: 2,
          limitPerPage: 1,
          totalItems: 2,
          previousPage: 1,
          nextPage: null,
        },
      });
    });

    it('should filter appointments', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const firstAppointment = await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
        notes: 'other_notes',
      });

      await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      const payload: FilterAllAppointmentsPayload = {
        unitId: [unit.id],
        medicId: [professional.professional.id],
        patientId: [patient.patient.id],
        notes: firstAppointment.notes,
        status: [firstAppointment.status],
      };

      const response = await request(app.getHttpServer())
        .get(`/appointments`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .query(payload)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        data: [
          {
            id: firstAppointment.id,
            date: firstAppointment.date.toISOString(),
            notes: firstAppointment.notes,
            medic: {
              id: professional.professional.id,
              name: professional.professional.name,
            },
            patient: {
              id: patient.patient.id,
              name: patient.patient.name,
            },
            unit: {
              id: unit.id,
              name: unit.name,
              code: unit.code,
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

  describe('/appointments (POST)', () => {
    it('should create an appointment', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const payload: CreateAppointmentPayload = {
        unitId: unit.id,
        patientId: patient.patient.id,
        medicId: professional.professional.id,
        type: AppointmentType.IN_PERSON,
        date: new Date(),
        notes: 'any_notes',
      };

      const response = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CREATED);

      const responseInDb = await repository.findOne({
        where: {
          id: response.body.id,
        },
        relations: {
          medic: true,
          patient: true,
          unit: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: response.body.id,
        date: payload.date,
        notes: payload.notes,
        medic: {
          id: professional.professional.id,
          name: professional.professional.name,
          speciality: professional.professional.speciality,
          type: ProfessionalType.MEDIC,
        },
        patient: {
          id: patient.patient.id,
          name: patient.patient.name,
          cpf: patient.patient.cpf,
          birthDate: patient.patient.birthDate,
          contact: patient.patient.contact,
        },
        unit: {
          id: unit.id,
          name: unit.name,
          code: unit.code,
          address: unit.address,
          type: unit.type,
        },
      });
    });

    it('should not create an appointment with an unit that does not exist', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const id = randomUUID();

      const payload: CreateAppointmentPayload = {
        unitId: id,
        patientId: patient.patient.id,
        medicId: professional.professional.id,
        type: AppointmentType.IN_PERSON,
        date: new Date(),
        notes: 'any_notes',
      };

      const response = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Unidade com ID ${id} não foi encontrada.`,
      });
    });

    it('should not create an appointment with a patient that does not exist', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const id = randomUUID();

      const payload: CreateAppointmentPayload = {
        unitId: unit.id,
        patientId: id,
        medicId: professional.professional.id,
        type: AppointmentType.IN_PERSON,
        date: new Date(),
        notes: 'any_notes',
      };

      const response = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Paciente com ID ${id} não foi encontrado.`,
      });
    });

    it('should not create an appointment with a medic that does not exist', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const id = randomUUID();

      const payload: CreateAppointmentPayload = {
        unitId: unit.id,
        patientId: patient.patient.id,
        medicId: id,
        type: AppointmentType.IN_PERSON,
        date: new Date(),
        notes: 'any_notes',
      };

      const response = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Médico com ID ${id} não foi encontrado.`,
      });
    });
  });

  describe('/appointments/:id (GET)', () => {
    it('should get appointment details', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const appointment = await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      const response = await request(app.getHttpServer())
        .get(`/appointments/${appointment.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: appointment.id,
        date: appointment.date.toISOString(),
        notes: appointment.notes,
        medic: {
          id: professional.professional.id,
          name: professional.professional.name,
        },
        patient: {
          id: patient.patient.id,
          name: patient.patient.name,
        },
        unit: {
          id: unit.id,
          name: unit.name,
          code: unit.code,
        },
      });
    });

    it('should not get appointment details with an appointment that does not exist', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .get(`/appointments/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `Consulta de ID ${id} não foi encontrada.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('/appointments/:id (PUT)', () => {
    it('should update an appointment', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const appointmentToUpdate = await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      const payload: UpdateAppointmentPayload = {
        unitId: unit.id,
        patientId: patient.patient.id,
        medicId: professional.professional.id,
        type: AppointmentType.ONLINE,
        date: new Date(),
        notes: 'updated_notes',
      };

      const response = await request(app.getHttpServer())
        .put(`/appointments/${appointmentToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: appointmentToUpdate.id,
        },
        relations: {
          medic: true,
          patient: true,
          unit: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: appointmentToUpdate.id,
        date: payload.date,
        notes: payload.notes,
        medic: {
          id: professional.professional.id,
          name: professional.professional.name,
          speciality: professional.professional.speciality,
          type: ProfessionalType.MEDIC,
        },
        patient: {
          id: patient.patient.id,
          name: patient.patient.name,
          cpf: patient.patient.cpf,
          birthDate: patient.patient.birthDate,
          contact: patient.patient.contact,
        },
        unit: {
          id: unit.id,
          name: unit.name,
          code: unit.code,
          address: unit.address,
          type: unit.type,
        },
      });
    });

    it('should not update an appointment with an unit that does not exist', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const appointmentToUpdate = await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      const id = randomUUID();

      const payload: UpdateAppointmentPayload = {
        unitId: id,
        patientId: patient.patient.id,
        medicId: professional.professional.id,
        type: AppointmentType.ONLINE,
        date: new Date(),
        notes: 'updated_notes',
      };

      const response = await request(app.getHttpServer())
        .put(`/appointments/${appointmentToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Unidade com ID ${id} não foi encontrada.`,
      });
    });

    it('should not update an appointment with a patient that does not exist', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const appointmentToUpdate = await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      const id = randomUUID();

      const payload: UpdateAppointmentPayload = {
        unitId: unit.id,
        patientId: id,
        medicId: professional.professional.id,
        type: AppointmentType.ONLINE,
        date: new Date(),
        notes: 'updated_notes',
      };

      const response = await request(app.getHttpServer())
        .put(`/appointments/${appointmentToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Paciente com ID ${id} não foi encontrado.`,
      });
    });

    it('should not update an appointment with a medic that does not exist', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const appointmentToUpdate = await createAppointmentMock({
        app,
        medic: professional.professional,
        patient: patient.patient,
        unit,
      });

      const id = randomUUID();

      const payload: UpdateAppointmentPayload = {
        unitId: unit.id,
        patientId: patient.patient.id,
        medicId: id,
        type: AppointmentType.ONLINE,
        date: new Date(),
        notes: 'updated_notes',
      };

      const response = await request(app.getHttpServer())
        .put(`/appointments/${appointmentToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Médico com ID ${id} não foi encontrado.`,
      });
    });

    it('should not update an appointment with an id that does not exist', async () => {
      const id = randomUUID();

      const { user: professional } = await createProfessionalMock({
        app,
        name: 'any_name',
        email: 'any_email@email.com',
      });

      const unit = await createUnitMock({
        app,
        code: 'any_code',
        name: 'any_name',
        professionals: [professional.professional],
      });

      const { user: patient } = await createPatientMock({
        app,
        email: 'patient_email@email.com',
        cpf: '09711801051',
        name: 'any_name',
      });

      const payload: UpdateAppointmentPayload = {
        unitId: unit.id,
        patientId: patient.patient.id,
        medicId: professional.professional.id,
        type: AppointmentType.ONLINE,
        date: new Date(),
        notes: 'updated_notes',
      };

      const response = await request(app.getHttpServer())
        .put(`/appointments/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `Consulta com ID ${id} não foi encontrada.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });
});
