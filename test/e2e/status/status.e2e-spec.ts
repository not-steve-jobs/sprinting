import request from 'supertest';
import {INestApplication} from '@nestjs/common';

import {MainDatabaseHelper} from '../utils/seed';
import {createTestNestApplication} from '../utils/helpers';
import {testTenant} from '../tenant/data';

import {testCaseStatus} from './data';

describe('Statuses', () => {
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

  // Handler for getting statuses
  describe(`GET /api/tenant/{tenantId}/statuses`, () => {
    it(`should return list with details for all statuses in the DB`, (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/statuses`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body).toContainObject({
            ...testCaseStatus,
            createdAt: testCaseStatus.createdAt.toISOString(),
            updatedAt: testCaseStatus.updatedAt.toISOString(),
          });
        })
        .end(done);
    });
  });

  it(`should return error for status using invalid tenant ID`, (done) => {
    const invalidTenantId = '123456789';

    request(app.getHttpServer())
      .get(`/tenant/${invalidTenantId}/statuses`)
      .set('Accept', 'application/json')
      .set('X-TenantId', tenantId.toString())
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

  afterAll(async () => {
    // TODO: Deal with the Redis connection, for some reason it's not closing successfully and the tests cannot exit
    await databaseHelper.cleanup();
    await app.close();
  });
});
