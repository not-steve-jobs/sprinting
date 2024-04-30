import request from 'supertest';
import {INestApplication} from '@nestjs/common';

import {MainDatabaseHelper} from '../utils/seed';
import {createTestNestApplication} from '../utils/helpers';

import {testCaseComment} from './data';

import {testUser} from '../users/data';
import {testTenant} from '../tenant/data';

describe('CaseComments', () => {
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

  // Handler for creating case comments
  describe(`POST /api/tenant/{tenantId}/case-comment`, () => {
    it(`should create a new Case Comment with provided minimum set of data and return details for the new record`, (done) => {
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/case-comment/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          caseId: testCaseComment.caseId,
          userId: testUser.id,
          userName: testCaseComment.userName,
          value: testCaseComment.value,
          createdBy: testUser.id,
        })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({
            tenantId: testCaseComment.tenantId,
            caseId: testCaseComment.caseId,
            userId: testCaseComment.userId,
            value: testCaseComment.value,
            isDraft: testCaseComment.isDraft,
            filesDeleted: testCaseComment.filesDeleted,
            userName: testCaseComment.userName,
          });

          databaseHelper.addCreatedRecord('CaseComment', response.body.id);
        })
        .end(done);
    });
  });

  it(`should throw an error because of invalid tenant`, (done) => {
    const invalidTenantId = 123456789;

    request(app.getHttpServer())
      .post(`/tenant/${invalidTenantId}/case-comment/`)
      .set('Accept', 'application/json')
      .set('X-TenantId', invalidTenantId.toString())
      .expect('Content-Type', /json/)
      .send({
        caseId: testCaseComment.caseId,
        userId: testUser.id,
        userName: testCaseComment.userName,
        value: testCaseComment.value,
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

  describe(`GET /api/tenant/{tenantId}/case/{caseId}/case-comment`, () => {
    it(`should get all Case Comments related with the provided Case`, (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/case/${testCaseComment.caseId}/case-comment/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body).toContainObject({
            ...testCaseComment,
            createdAt: testCaseComment.createdAt.toISOString(),
            updatedAt: testCaseComment.updatedAt.toISOString(),
          });
        })
        .end(done);
    });

    xit(`should throw an error if the provided Case is invalid`, (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/case/00000000-0000-0000-0000-000000000000/case-comment/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'CaseCommentFetchError',
            },
          });
        })
        .end(done);
    });

    it(`should throw an error if the provided Tenant is invalid`, (done) => {
      request(app.getHttpServer())
        .get(`/tenant/88888/case/${testCaseComment.caseId}/case-comment/`)
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
  });

  afterAll(async () => {
    // TODO: Deal with the Redis connection, for some reason it's not closing successfully and the tests cannot exit
    await databaseHelper.cleanup();
    await app.close();
  });
});
