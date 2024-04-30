import request from 'supertest';
import {INestApplication} from '@nestjs/common';

import {MainDatabaseHelper} from '../utils/seed';
import {createTestNestApplication} from '../utils/helpers';

import {testCaseCategory} from './data';
import {testTenant} from '../tenant/data';

describe('CaseCategories', () => {
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

  // Handler for retrieving case categories
  describe(`GET /api/case-categories`, () => {
    it(`should return list with details for all Case Categories in the DB`, (done) => {
      request(app.getHttpServer())
        .get(`/case-categories`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body).toContainObject({
            ...testCaseCategory,
            createdAt: testCaseCategory.createdAt.toISOString(),
            updatedAt: testCaseCategory.updatedAt.toISOString(),
          });
        })
        .end(done);
    });
  });

  // Handler for retrieving case category by name
  describe(`GET /api/case-category/name/{name}`, () => {
    // TODO: Add negative tests when provided wrong name

    it(`should return details for the Case Category if the record exists in the DB`, (done) => {
      request(app.getHttpServer())
        .get(`/case-category/name/${testCaseCategory.name}/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...testCaseCategory,
            createdAt: testCaseCategory.createdAt.toISOString(),
            updatedAt: testCaseCategory.updatedAt.toISOString(),
          });
        })
        .end(done);
    });
  });

  afterAll(async () => {
    // TODO: Deal with the Redis connection, for some reason it's not closing successfully and the tests cannot exit
    await databaseHelper.cleanup();
    await app.close();
  });
});
