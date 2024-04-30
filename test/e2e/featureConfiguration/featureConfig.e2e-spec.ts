import request from 'supertest';
import {INestApplication} from '@nestjs/common';

import {MainDatabaseHelper} from '../utils/seed';
import {createTestNestApplication} from '../utils/helpers';
import {testFeatureConfiguration, testFeatureConfigurationDisabled} from './data';
import {testTenant} from '../tenant/data';
import {FeatureConfigurationIdentifier} from 'src/modules/featureConfiguration/featureConfiguration.interface';

describe('Feature Configuration', () => {
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

  // Handler for getting Feature Configuration by feature and channel
  describe(`GET /api/tenant/{tenantId}/featureConfiguration/{feature}/{channel}`, () => {
    it(`should return details for the requested feature configuration`, (done) => {
      request(app.getHttpServer())
        .get(
          `/tenant/${tenantId}/featureConfiguration/${testFeatureConfiguration.feature}/${testFeatureConfiguration.channel}`,
        )
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...testFeatureConfiguration,
            createdAt: testFeatureConfiguration.createdAt.toISOString(),
            updatedAt: testFeatureConfiguration.updatedAt.toISOString(),
          });
        })
        .end(done);
    });

    it(`should return error if provided invalid Tenant ID`, (done) => {
      const invalidTenantId = '123456789';

      request(app.getHttpServer())
        .get(`/tenant/${invalidTenantId}/featureConfiguration/testFeature/testChannel`)
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

    it(`should return error if the provided feature is invalid and doesn't exist in the DB`, (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/featureConfiguration/invalidTestFeature/testChannel`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'EntityNotFoundError',
            },
          });
        })
        .end(done);
    });

    it(`should return error if the provided channel is invalid and doesn't exist in the DB`, (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/featureConfiguration/testFeature/invalidTestChannel`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'EntityNotFoundError',
            },
          });
        })
        .end(done);
    });
  });

  // Handler for getting multiple Feature Configurations by feature and channel
  describe(`GET /api/tenant/{tenantId}/featureConfiguration/features`, () => {
    const testFeatureQueryIdentifier: FeatureConfigurationIdentifier = {
      feature: testFeatureConfiguration.feature,
      channel: testFeatureConfiguration.channel,
    };

    it(`should return error if provided invalid Tenant ID`, (done) => {
      const invalidTenantId = '123456789';

      request(app.getHttpServer())
        .post(`/tenant/${invalidTenantId}/featureConfiguration/features`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .send({
          query: [testFeatureQueryIdentifier],
        })
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

    it(`should return error if not provided any payload with query for the requested features`, (done) => {
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/featureConfiguration/features`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'DataValidationError',
              data: {
                validationErrors: [
                  {
                    target: {},
                    property: 'query',
                    children: [],
                    constraints: {
                      isArray: 'query must be an array',
                    },
                  },
                ],
              },
            },
          });
        })
        .end(done);
    });

    it(`should return empty response if the input for the list of requested features is blank`, (done) => {
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/featureConfiguration/features`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .send({
          query: [],
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject([]);
        })
        .end(done);
    });

    describe(`get one feature configuration`, () => {
      it(`should return error if provided invalid channel in the query for the requested features`, (done) => {
        const featureConfigurationInvalidChannel = 'INVALID_CHANNEL';

        request(app.getHttpServer())
          .post(`/tenant/${tenantId}/featureConfiguration/features`)
          .set('Accept', 'application/json')
          .set('X-TenantId', tenantId.toString())
          .send({
            query: [
              {
                feature: testFeatureConfigurationDisabled.feature,
                channel: featureConfigurationInvalidChannel,
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .expect((response) => {
            expect(response.body).toMatchObject({
              status: 400,
              error: {
                name: 'EntityNotFoundError',
                data: {
                  id: `{"tenantId":${tenantId},"feature":"${testFeatureConfigurationDisabled.feature}","channel":"${featureConfigurationInvalidChannel}"}`,
                  name: 'FeatureConfiguration',
                },
              },
            });
          })
          .end(done);
      });

      it(`should return error if provided invalid feature in the query for the requested features`, (done) => {
        const featureConfigurationInvalidFeature = 'INVALID_FEATURE';

        request(app.getHttpServer())
          .post(`/tenant/${tenantId}/featureConfiguration/features`)
          .set('Accept', 'application/json')
          .set('X-TenantId', tenantId.toString())
          .send({
            query: [
              {
                feature: featureConfigurationInvalidFeature,
                channel: testFeatureConfigurationDisabled.channel,
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .expect((response) => {
            expect(response.body).toMatchObject({
              status: 400,
              error: {
                name: 'EntityNotFoundError',
                data: {
                  id: `{"tenantId":${tenantId},"feature":"${featureConfigurationInvalidFeature}","channel":"${testFeatureConfigurationDisabled.channel}"}`,
                  name: 'FeatureConfiguration',
                },
              },
            });
          })
          .end(done);
      });

      it(`should return details for the requested feature configuration`, (done) => {
        request(app.getHttpServer())
          .post(`/tenant/${tenantId}/featureConfiguration/features`)
          .set('Accept', 'application/json')
          .set('X-TenantId', tenantId.toString())
          .send({
            query: [testFeatureQueryIdentifier],
          })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((response) => {
            expect(response.body).toContainObject({
              ...testFeatureConfiguration,
              createdAt: testFeatureConfiguration.createdAt.toISOString(),
              updatedAt: testFeatureConfiguration.updatedAt.toISOString(),
            });
          })
          .end(done);
      });
    });

    describe(`get multiple feature configurations`, () => {
      it(`should return error if provided invalid channel in the query for the requested features`, (done) => {
        const featureConfigurationInvalidChannel = 'INVALID_CHANNEL';

        request(app.getHttpServer())
          .post(`/tenant/${tenantId}/featureConfiguration/features`)
          .set('Accept', 'application/json')
          .set('X-TenantId', tenantId.toString())
          .send({
            query: [
              testFeatureQueryIdentifier,
              {
                feature: testFeatureConfigurationDisabled.feature,
                channel: featureConfigurationInvalidChannel,
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .expect((response) => {
            expect(response.body).toMatchObject({
              status: 400,
              error: {
                name: 'EntityNotFoundError',
                data: {
                  id: `{"tenantId":${tenantId},"feature":"${testFeatureConfigurationDisabled.feature}","channel":"${featureConfigurationInvalidChannel}"}`,
                  name: 'FeatureConfiguration',
                },
              },
            });
          })
          .end(done);
      });

      it(`should return error if provided invalid feature in the query for the requested features`, (done) => {
        const featureConfigurationInvalidFeature = 'INVALID_FEATURE';

        request(app.getHttpServer())
          .post(`/tenant/${tenantId}/featureConfiguration/features`)
          .set('Accept', 'application/json')
          .set('X-TenantId', tenantId.toString())
          .send({
            query: [
              testFeatureQueryIdentifier,
              {
                feature: featureConfigurationInvalidFeature,
                channel: testFeatureConfigurationDisabled.channel,
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .expect((response) => {
            expect(response.body).toMatchObject({
              status: 400,
              error: {
                name: 'EntityNotFoundError',
                data: {
                  id: `{"tenantId":${tenantId},"feature":"${featureConfigurationInvalidFeature}","channel":"${testFeatureConfigurationDisabled.channel}"}`,
                  name: 'FeatureConfiguration',
                },
              },
            });
          })
          .end(done);
      });

      it(`should return details for the requested feature configurations`, (done) => {
        request(app.getHttpServer())
          .post(`/tenant/${tenantId}/featureConfiguration/features`)
          .set('Accept', 'application/json')
          .set('X-TenantId', tenantId.toString())
          .send({
            query: [
              testFeatureQueryIdentifier,
              {
                feature: testFeatureConfigurationDisabled.feature,
                channel: testFeatureConfigurationDisabled.channel,
              },
            ],
          })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((response) => {
            expect(response.body).toContainObject({
              ...testFeatureConfiguration,
              createdAt: testFeatureConfiguration.createdAt.toISOString(),
              updatedAt: testFeatureConfiguration.updatedAt.toISOString(),
            });

            expect(response.body).toContainObject({
              ...testFeatureConfigurationDisabled,
              createdAt: testFeatureConfigurationDisabled.createdAt.toISOString(),
              updatedAt: testFeatureConfigurationDisabled.updatedAt.toISOString(),
            });
          })
          .end(done);
      });
    });
  });

  afterAll(async () => {
    // TODO: Deal with the Redis connection, for some reason it's not closing successfully and the tests cannot exit
    await databaseHelper.cleanup();
    await app.close();
  });
});
