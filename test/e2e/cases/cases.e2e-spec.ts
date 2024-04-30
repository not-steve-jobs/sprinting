import request from 'supertest';
import {INestApplication} from '@nestjs/common';

import {Case} from 'src/modules/case/case.entity';

import {MainDatabaseHelper} from '../utils/seed';
import {createTestNestApplication} from '../utils/helpers';

import {testCase} from './data';
import {testUser} from '../users/data';
import {testTenant} from '../tenant/data';

describe('Cases', () => {
  // Test instance of the Nest.js application used to execute the real API endpoints
  let app: INestApplication;

  // The Tenant ID which we use in the tests bellow
  const tenantId: number = testTenant.id;

  // Custom helper class which provides some functions for easier interaction with the database
  let databaseHelper;

  beforeAll(async () => {
    app = await createTestNestApplication({tenantId});

    databaseHelper = new MainDatabaseHelper();
  });

  // Handler for creating Case
  describe('POST /api/tenant/{tenantId}/case', () => {
    // TODO: Add test for full list of provided params
    // TODO: Add tests for invalid params

    it(`should create a new Case with provided minimum set of data and return details for the new record`, (done) => {
      const newTestCase: Partial<Case> = {
        tenantId: testCase.tenantId,
        entityName: testCase.entityName,
        subject: 'Test Subject',
        description: 'Test Description.',
        // statusId: testCase.statusId, // TODO: Get the real status
        caseCategoryId: testCase.caseCategoryId,
        userId: testUser.id,
      };

      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/case/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          tenantId: newTestCase.tenantId,
          entityName: newTestCase.entityName,
          subject: newTestCase.subject,
          description: newTestCase.description,
          caseCategoryId: newTestCase.caseCategoryId,
          createdBy: testUser.id,
        })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...newTestCase,
          });

          databaseHelper.addCreatedRecord('Case', response.body.id);
        })
        .end(done);
    });

    it(`should throw an error because of invalid tenant`, (done) => {
      const invalidTenantId = 123456789;
      const newTestCase: Partial<Case> = {
        tenantId: testCase.tenantId,
        entityName: testCase.entityName,
        subject: 'Test Subject',
        description: 'Test Description.',
        // statusId: testCase.statusId, // TODO: Get the real status
        caseCategoryId: testCase.caseCategoryId,
        userId: testUser.id,
      };
      request(app.getHttpServer())
        .post(`/tenant/${invalidTenantId}/case/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', invalidTenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          tenantId: newTestCase.tenantId,
          entityName: newTestCase.entityName,
          subject: newTestCase.subject,
          description: newTestCase.description,
          caseCategoryId: newTestCase.caseCategoryId,
          createdBy: testUser.id,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'AuthTokenUserMissingError',
            },
          });
        })
        .end(done);
    });
  });

  // TODO: POST /api/tenant/{tenantId}/cases - Handler for retrieving Cases
  // TODO: PATCH /api/tenant/{tenantId}/case/{caseId} - /api/tenant/{tenantId}/case/{caseId}

  // Handler for retrieving Case
  describe(`GET /api/tenant/{tenantId}/case/{caseId}`, () => {
    it(`should throw an error if the provided Tenant is invalid`, (done) => {
      const invalidTenantId = '123456789';

      return request(app.getHttpServer())
        .get(`/tenant/${invalidTenantId}/case/${testCase.id}/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', invalidTenantId)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'AuthTokenUserMissingError',
            },
          });
        })
        .end(done);
    });

    // Temporary disabled because of broken functionality, the test is valid!
    xit(`should throw an error if the requested Case doesn't exists in the DB`, (done) => {
      return request(app.getHttpServer())
        .get(`/tenant/${tenantId}/case/00000000-0000-0000-0000-000000000000/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'CaseFetchError',
            },
          });
        })
        .end(done);
    });

    it(`should return details for the Case if the record exists in the DB`, (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/case/${testCase.id}/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...testCase,
            createdAt: testCase.createdAt.toISOString(),
            updatedAt: testCase.updatedAt.toISOString(),
          });
        })
        .end(done);
    });
  });

  // POST /api/tenant/{tenantId}/user/{userId}/case - Handler for creating case files

  afterAll(async () => {
    // TODO: Deal with the Redis connection, for some reason it's not closing successfully and the tests cannot exit
    await databaseHelper.cleanup();
    await app.close();
  });
});
