import request from 'supertest';

import {testClientConfiguration} from '../clientConfiguration/data';
import {createTestNestApplication} from '../utils/helpers';
import {MainDatabaseHelper} from '../utils/seed';
import {INestApplication} from '@nestjs/common';

describe('Client Configuration', () => {
  let app: INestApplication;

  let databaseHelper: MainDatabaseHelper;

  const tenantId = testClientConfiguration.tenantId;

  beforeAll(async () => {
    app = await createTestNestApplication({tenantId});
    databaseHelper = new MainDatabaseHelper();
  });

  afterAll(async () => {
    await databaseHelper.cleanup();
    await app.close();
  });

  describe('GET /api/tenant/{tenantId}/client/{clientId}/configuration/{feature}/{channel}/{roleId}', () => {
    it('should throw an error when wrong tenantId provided', (done) => {
      const wrongTenantId = 1111;

      const tenantId = wrongTenantId;
      const {channel, clientId, feature, roleId} = testClientConfiguration;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}/configuration/${feature}/${channel}/${roleId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
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

    it('should throw an error when wrong clientId provided', (done) => {
      const wrongClientId = '12345678-4444-4444-4444-444444444441';

      const {channel, feature, roleId} = testClientConfiguration;
      const clientId = wrongClientId;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}/configuration/${feature}/${channel}/${roleId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject({
            error: {
              name: 'EntityNotFoundError',
            },
          });
        })
        .end(done);
    });

    it('should throw an error when wrong feature provided', (done) => {
      const wrongFeature = 'wrongTestFeature';

      const {channel, clientId, roleId} = testClientConfiguration;
      const feature = wrongFeature;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}/configuration/${feature}/${channel}/${roleId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject({
            error: {
              name: 'EntityNotFoundError',
            },
          });
        })
        .end(done);
    });

    it('should throw an error when wrong channel provided', (done) => {
      const wrongChannel = 'wrongChannel';

      const {feature, clientId, roleId} = testClientConfiguration;
      const channel = wrongChannel;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}/configuration/${feature}/${channel}/${roleId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject({
            error: {
              name: 'EntityNotFoundError',
            },
          });
        })
        .end(done);
    });

    // TODO: This test is wrong, it should verify the response
    // TODO: Also, why we have a valid response in case we provide an invalid role
    it.skip('should response with FeatureConfiguration when wrong roleId provided', (done) => {
      const wrongRoleId = 66666;

      const {channel, feature, clientId} = testClientConfiguration;
      const roleId = wrongRoleId;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}/configuration/${feature}/${channel}/${roleId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeTruthy();
        })
        .end(done);
    });

    // TODO: This test is wrong, it should verify the response
    it.skip('should response with all data', (done) => {
      const {channel, feature, clientId, roleId} = testClientConfiguration;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}/configuration/${feature}/${channel}/${roleId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeTruthy();
        })
        .end(done);
    });
  });

  describe('GET /api/tenant/{tenantId}/client/{clientId}/main-menu', () => {
    it('should throw an error when wrong tenantId provided', (done) => {
      const wrongTenantId = 77766;

      const {clientId} = testClientConfiguration;
      const tenantId = wrongTenantId;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}/main-menu`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
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

    // TODO: This test is wrong, it should verify the response
    it.skip('should response when wrong clientId provided', (done) => {
      const wrongClientId = '12345678-4444-4444-4444-444444444441';
      const clientId = wrongClientId;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}/main-menu`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeTruthy();
        })
        .end(done);
    });

    // TODO: This test is wrong, it should verify the response
    it.skip('should response with all data', (done) => {
      const {clientId} = testClientConfiguration;

      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/client/${clientId}/main-menu`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeTruthy();
        })
        .end(done);
    });
  });
});
