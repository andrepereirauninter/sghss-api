import { randomUUID } from 'node:crypto';
import request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { CreateUnitPayload } from '../../../apps/units/payload/create-unit.payload';
import { FilterAllUnitsPayload } from '../../../apps/units/payload/filter-all-units.payload';
import { UpdateUnitPayload } from '../../../apps/units/payload/update-unit.payload';
import { UnitRepository } from '../../../apps/units/repositories/unit.repository';
import { UnitType } from '../../../apps/users/enums/unit-type.enum';
import { loginMock } from '../../mocks/auth/login.mock';
import { createUnitMock } from '../../mocks/units/create-unit.mock';
import { createProfessionalMock } from '../../mocks/users/create-professional.mock';
import {
  generateDefaultAppAfterEachSetup,
  generateDefaultAppBeforeEachSetup,
} from '../../utils/setup';

describe('UnitController (e2e)', () => {
  let app: INestApplication;
  let repository: UnitRepository;
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

    repository = app.get(UnitRepository);
  });

  afterEach(async () => {
    await generateDefaultAppAfterEachSetup(app);
  });

  describe('/units (GET)', () => {
    it('should list units', async () => {
      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const { user: thirdProfessional } = await createProfessionalMock({
        app,
        email: 'third_professional@email.com',
        name: 'another_name',
      });

      const firstUnit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        professionals: [
          firstProfessional.professional,
          secondProfessional.professional,
        ],
      });

      const secondUnit = await createUnitMock({
        app,
        name: 'other_name',
        code: 'other_code',
        professionals: [
          secondProfessional.professional,
          thirdProfessional.professional,
        ],
      });

      const response = await request(app.getHttpServer())
        .get(`/units`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        data: [
          {
            id: secondUnit.id,
            name: secondUnit.name,
            code: secondUnit.code,
            professionals: [
              {
                id: secondProfessional.professional.id,
                name: secondProfessional.professional.name,
              },
              {
                id: thirdProfessional.professional.id,
                name: thirdProfessional.professional.name,
              },
            ],
          },
          {
            id: firstUnit.id,
            name: firstUnit.name,
            code: firstUnit.code,
            professionals: [
              {
                id: firstProfessional.professional.id,
                name: firstProfessional.professional.name,
              },
              {
                id: secondProfessional.professional.id,
                name: secondProfessional.professional.name,
              },
            ],
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

    it('should paginate units', async () => {
      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const { user: thirdProfessional } = await createProfessionalMock({
        app,
        email: 'third_professional@email.com',
        name: 'another_name',
      });

      const firstUnit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        professionals: [
          firstProfessional.professional,
          secondProfessional.professional,
        ],
      });

      await createUnitMock({
        app,
        name: 'other_name',
        code: 'other_code',
        professionals: [
          secondProfessional.professional,
          thirdProfessional.professional,
        ],
      });

      const payload: FilterAllUnitsPayload = {
        page: 2,
        limit: 1,
      };

      const response = await request(app.getHttpServer())
        .get(`/units`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .query(payload)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        data: [
          {
            id: firstUnit.id,
            name: firstUnit.name,
            code: firstUnit.code,
            professionals: [
              {
                id: firstProfessional.professional.id,
                name: firstProfessional.professional.name,
              },
              {
                id: secondProfessional.professional.id,
                name: secondProfessional.professional.name,
              },
            ],
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

    it('should filter units', async () => {
      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const { user: thirdProfessional } = await createProfessionalMock({
        app,
        email: 'third_professional@email.com',
        name: 'another_name',
      });

      await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        professionals: [
          firstProfessional.professional,
          secondProfessional.professional,
        ],
      });

      const secondUnit = await createUnitMock({
        app,
        name: 'other_name',
        code: 'other_code',
        active: false,
        professionals: [
          secondProfessional.professional,
          thirdProfessional.professional,
        ],
      });

      const payload: FilterAllUnitsPayload = {
        name: secondUnit.name,
        code: secondUnit.code,
        active: secondUnit.active,
        professionalName: secondUnit.professionals[0].name,
        type: [secondUnit.type],
        address: secondUnit.address,
      };

      const response = await request(app.getHttpServer())
        .get(`/units`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .query(payload)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        data: [
          {
            id: secondUnit.id,
            name: secondUnit.name,
            code: secondUnit.code,
            professionals: [
              {
                id: secondProfessional.professional.id,
                name: secondProfessional.professional.name,
              },
              {
                id: thirdProfessional.professional.id,
                name: thirdProfessional.professional.name,
              },
            ],
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

  describe('/units/search (GET)', () => {
    it('should search units', async () => {
      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const { user: thirdProfessional } = await createProfessionalMock({
        app,
        email: 'third_professional@email.com',
        name: 'another_name',
      });

      const firstUnit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        professionals: [
          firstProfessional.professional,
          secondProfessional.professional,
        ],
      });

      const secondUnit = await createUnitMock({
        app,
        name: 'other_name',
        code: 'other_code',
        professionals: [
          secondProfessional.professional,
          thirdProfessional.professional,
        ],
      });

      const response = await request(app.getHttpServer())
        .get(`/units/search`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: secondUnit.id,
          name: secondUnit.name,
          code: secondUnit.code,
        },
        {
          id: firstUnit.id,
          name: firstUnit.name,
          code: firstUnit.code,
        },
      ]);
    });

    it('should search with filters', async () => {
      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const { user: thirdProfessional } = await createProfessionalMock({
        app,
        email: 'third_professional@email.com',
        name: 'another_name',
      });

      await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        professionals: [
          firstProfessional.professional,
          secondProfessional.professional,
        ],
      });

      const secondUnit = await createUnitMock({
        app,
        name: 'other_name',
        code: 'other_code',
        active: false,
        professionals: [
          secondProfessional.professional,
          thirdProfessional.professional,
        ],
      });

      const payload: FilterAllUnitsPayload = {
        name: secondUnit.name,
        code: secondUnit.code,
        active: secondUnit.active,
        professionalName: secondUnit.professionals[0].name,
        type: [secondUnit.type],
        address: secondUnit.address,
      };

      const response = await request(app.getHttpServer())
        .get(`/units/search`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .query(payload)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: secondUnit.id,
          name: secondUnit.name,
          code: secondUnit.code,
        },
      ]);
    });
  });

  describe(`/units (POST)`, () => {
    it(`should create a unit`, async () => {
      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const payload: CreateUnitPayload = {
        name: 'any_name',
        code: 'any_code',
        active: true,
        type: UnitType.HOSPITAL,
        address: 'any_address',
        professionals: [
          firstProfessional.professional.id,
          secondProfessional.professional.id,
        ],
      };

      const response = await request(app.getHttpServer())
        .post(`/units`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CREATED);

      const responseInDb = await repository.findOne({
        where: {
          code: payload.code,
        },
        relations: {
          professionals: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: expect.any(String),
        name: payload.name,
        code: payload.code,
        active: payload.active,
        type: payload.type,
        address: payload.address,
        professionals: [
          {
            id: firstProfessional.professional.id,
            name: firstProfessional.professional.name,
          },
          {
            id: secondProfessional.professional.id,
            name: secondProfessional.professional.name,
          },
        ],
      });
    });

    it(`should not create a unit with duplicated code`, async () => {
      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const existingUnit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        professionals: [
          firstProfessional.professional,
          secondProfessional.professional,
        ],
      });

      const payload: CreateUnitPayload = {
        name: 'any_name',
        code: existingUnit.code,
        active: true,
        type: UnitType.HOSPITAL,
        address: 'any_address',
        professionals: [
          firstProfessional.professional.id,
          secondProfessional.professional.id,
        ],
      };

      const response = await request(app.getHttpServer())
        .post(`/units`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message: `Uma unidade com o código ${payload.code} já existe.`,
      });
    });

    it('should not create a unit with invalid professionals', async () => {
      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const payload: CreateUnitPayload = {
        name: 'any_name',
        code: 'any_code',
        active: true,
        type: UnitType.HOSPITAL,
        address: 'any_address',
        professionals: [firstProfessional.professional.id, randomUUID()],
      };

      const response = await request(app.getHttpServer())
        .post(`/units`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Alguns profissionais de saúde não foram encontrados com os IDs: ${payload.professionals[1]}.`,
      });
    });
  });

  describe('/units/:id (GET)', () => {
    it('should get unit details', async () => {
      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const unit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        professionals: [
          firstProfessional.professional,
          secondProfessional.professional,
        ],
      });

      const response = await request(app.getHttpServer())
        .get(`/units/${unit.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: unit.id,
        name: unit.name,
        code: unit.code,
        professionals: [
          {
            id: firstProfessional.professional.id,
            name: firstProfessional.professional.name,
          },
          {
            id: secondProfessional.professional.id,
            name: secondProfessional.professional.name,
          },
        ],
      });
    });

    it('should not get unit details if it does not exist ', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .get(`/units/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `Unidade com ID ${id} não foi encontrada.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('/units/:id/activate (POST)', () => {
    it(`should activate a unit`, async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'any_professional@email.com',
        name: 'any_name',
      });

      const unit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        active: false,
        professionals: [professional.professional],
      });

      const response = await request(app.getHttpServer())
        .post(`/units/${unit.id}/activate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: unit.id,
        },
      });

      expect(responseInDb?.active).toBe(true);
    });

    it('should do nothing if the unit already is active', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'any_professional@email.com',
        name: 'any_name',
      });

      const unit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        active: true,
        professionals: [professional.professional],
      });

      const response = await request(app.getHttpServer())
        .post(`/units/${unit.id}/activate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: unit.id,
        },
      });

      expect(responseInDb?.active).toBe(true);
    });

    it('should not activate a unit if it does not exist', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .post(`/units/${id}/activate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `Unidade com ID ${id} não foi encontrada.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('/units/:id/deactivate (POST)', () => {
    it(`should deactivate a unit`, async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'any_professional@email.com',
        name: 'any_name',
      });

      const unit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        active: false,
        professionals: [professional.professional],
      });

      const response = await request(app.getHttpServer())
        .post(`/units/${unit.id}/deactivate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: unit.id,
        },
      });

      expect(responseInDb?.active).toBe(false);
    });

    it('should do nothing if the unit already is inactive', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'any_professional@email.com',
        name: 'any_name',
      });

      const unit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        active: true,
        professionals: [professional.professional],
      });

      const response = await request(app.getHttpServer())
        .post(`/units/${unit.id}/deactivate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: unit.id,
        },
      });

      expect(responseInDb?.active).toBe(false);
    });

    it('should not deactivate a unit if it does not exist', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .post(`/units/${id}/deactivate`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `Unidade com ID ${id} não foi encontrada.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('users/:id (PUT)', () => {
    it(`should update a unit`, async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'any_professional@email.com',
        name: 'any_name',
      });

      const existingUnit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        active: false,
        professionals: [professional.professional],
      });

      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'first_professional',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const payload: UpdateUnitPayload = {
        name: 'updated_name',
        code: 'updated_code',
        active: false,
        type: UnitType.CLINIC,
        address: 'updated_address',
        professionals: [
          firstProfessional.professional.id,
          secondProfessional.professional.id,
        ],
      };

      const response = await request(app.getHttpServer())
        .put(`/units/${existingUnit.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          code: payload.code,
        },
        relations: {
          professionals: true,
        },
      });

      expect(responseInDb).toMatchObject({
        id: expect.any(String),
        name: payload.name,
        code: payload.code,
        active: payload.active,
        type: payload.type,
        address: payload.address,
        professionals: [
          {
            id: firstProfessional.professional.id,
            name: firstProfessional.professional.name,
          },
          {
            id: secondProfessional.professional.id,
            name: secondProfessional.professional.name,
          },
        ],
      });
    });

    it('should not update a unit that does not exist', async () => {
      const id = randomUUID();

      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'any_name',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const payload: UpdateUnitPayload = {
        name: 'any_name',
        code: 'any_code',
        active: true,
        type: UnitType.HOSPITAL,
        address: 'any_address',
        professionals: [
          firstProfessional.professional.id,
          secondProfessional.professional.id,
        ],
      };

      const response = await request(app.getHttpServer())
        .put(`/units/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `Unidade com ID ${id} não foi encontrada.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });

    it(`should not update a unit with duplicated code`, async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'any_professional@email.com',
        name: 'any_name',
      });

      const existingUnit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        active: false,
        professionals: [professional.professional],
      });

      const unitToUpdate = await createUnitMock({
        app,
        name: 'other_name',
        code: 'other_code',
        active: false,
        professionals: [professional.professional],
      });

      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'first_professional',
      });

      const { user: secondProfessional } = await createProfessionalMock({
        app,
        email: 'second_professional@email.com',
        name: 'other_name',
      });

      const payload: UpdateUnitPayload = {
        name: 'updated_name',
        code: existingUnit.code,
        active: false,
        type: UnitType.CLINIC,
        address: 'updated_address',
        professionals: [
          firstProfessional.professional.id,
          secondProfessional.professional.id,
        ],
      };

      const response = await request(app.getHttpServer())
        .put(`/units/${unitToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message: `Uma unidade com o código ${payload.code} já existe.`,
      });
    });

    it('should not update a unit with invalid professionals', async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'any_professional@email.com',
        name: 'any_name',
      });

      const unitToUpdate = await createUnitMock({
        app,
        name: 'other_name',
        code: 'other_code',
        active: false,
        professionals: [professional.professional],
      });

      const { user: firstProfessional } = await createProfessionalMock({
        app,
        email: 'first_professional@email.com',
        name: 'first_professional',
      });

      const payload: UpdateUnitPayload = {
        name: 'updated_name',
        code: 'updated_code',
        active: false,
        type: UnitType.CLINIC,
        address: 'updated_address',
        professionals: [firstProfessional.professional.id, randomUUID()],
      };

      const response = await request(app.getHttpServer())
        .put(`/units/${unitToUpdate.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Alguns profissionais de saúde não foram encontrados com os IDs: ${payload.professionals[1]}.`,
      });
    });
  });

  describe('/units/:id (DELETE)', () => {
    it(`should delete a unit`, async () => {
      const { user: professional } = await createProfessionalMock({
        app,
        email: 'any_professional@email.com',
        name: 'any_name',
      });

      const unit = await createUnitMock({
        app,
        name: 'any_name',
        code: 'any_code',
        professionals: [professional.professional],
      });

      const response = await request(app.getHttpServer())
        .delete(`/units/${unit.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const responseInDb = await repository.findOne({
        where: {
          id: unit.id,
        },
      });

      expect(responseInDb).toBeNull();
    });

    it('should not delete a unit if it does not exist', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .delete(`/units/${id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send();

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: `Unidade com ID ${id} não foi encontrada.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });
});
