import request from 'supertest';
import {INestApplication} from '@nestjs/common';

import {testClientProfile} from './data';
import {MainDatabaseHelper} from '../utils/seed';
import {createTestNestApplication} from '../utils/helpers';
import {testClient} from '../clients/data';
import {testTenant} from '../tenant/data';

describe('Client Profile', () => {
  // Test instance of the Nest.js application used to execute the real API endpoints
  let app: INestApplication;

  // Custom helper class which provides some functions for easier interaction with the database
  let databaseHelper;

  const tenantId: number = testTenant.id;
  const clientId: string = testClient?.id;

  beforeAll(async () => {
    app = await createTestNestApplication({tenantId});

    databaseHelper = new MainDatabaseHelper();
  });

  afterAll(async () => {
    // TODO: Deal with the Redis connection, for some reason it's not closing successfully and the tests cannot exit
    await databaseHelper.cleanup();
    await app.close();
  });

  // Handler for Client Profile Update
  describe('UPDATE /api/tenant/{tenantId}/client/{clientId}', () => {
    it('should return error if trying to modify client profile with wrong tenantId', (done) => {
      const wrongTenantId = 7766;
      const tenantId = wrongTenantId;

      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/client/${clientId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({...testClientProfile})
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            error: {
              name: 'AuthTokenUserMissingError',
            },
          });
        })
        .end(done);
    });

    it('should return error if trying to modify client profile with wrong clientId', (done) => {
      const wrongClientId = '12345678-0000-4000-0000-111000000001';
      const clientId = wrongClientId;
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/client/${clientId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({...testClientProfile, id: wrongClientId})
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            error: {
              name: 'AuthTokenUserMissingError',
            },
          });
        })
        .end(done);
    });

    it(' return a correct response when provided valid data', (done) => {
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/client/${clientId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({...testClientProfile})
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({...testClientProfile});
        })
        .end(done);
    });
  });

  // Handler for Client Profile Getter
  describe('GET /api/tenant/{tenantId}/client/{clientId}', () => {
    it('should throw an error when wrong tenantId provided', (done) => {
      const invalidTenantId = 66667777;

      request(app.getHttpServer())
        .get(`/tenant/${invalidTenantId}/client/${clientId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', invalidTenantId.toString())
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject({
            error: {
              name: 'AuthTokenUserMissingError',
            },
          });
        })
        .end(done);
    });

    it('should throw an error when wrong tenantId provided', (done) => {
      const wrongClientId = '00000000-0000-4000-0000-000000000019';

      const tenantId = 110;
      const clientId = wrongClientId;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            error: {
              name: 'AuthTokenUserMissingError',
            },
          });
        })
        .end(done);
    });

    fit('should return a correct response when provided valid data', (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        // .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...testClientProfile,
          });
        })
        .end(done);
    });
  });
});
