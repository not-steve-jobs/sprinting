import request from 'supertest';
import {INestApplication} from '@nestjs/common';
import {MainDatabaseHelper} from '../utils/seed';
import {createTestNestApplication} from '../utils/helpers';
import {testCloseReasons, testTenantId} from './data';
import {CloseReasonTypeEnum} from 'src/modules/closeReason/closeReason.enum';

describe('CloseReason', () => {
  let app: INestApplication;
  let databaseHelper: MainDatabaseHelper;

  beforeAll(async () => {
    app = await createTestNestApplication({tenantId: testTenantId});
    databaseHelper = new MainDatabaseHelper();
  });

  // Handler for getting close reasons
  describe(`GET /api/tenant/{tenantId}/close-reasons/internal`, () => {
    it(`should return list with details for all internal and common close reasons in the DB`, (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${testTenantId}/close-reasons/internal`)
        .set('Accept', 'application/json')
        .set('X-TenantId', testTenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          const expectationsYes = [];
          const expectationsNo = [];
          testCloseReasons.forEach((item) => {
            if (item.type === CloseReasonTypeEnum.External) {
              expectationsNo.push(
                expect.objectContaining({
                  ...item,
                  createdAt: item.createdAt.toISOString(),
                  updatedAt: item.updatedAt.toISOString(),
                }),
              );
            } else {
              expectationsYes.push(
                expect.objectContaining({
                  ...item,
                  createdAt: item.createdAt.toISOString(),
                  updatedAt: item.updatedAt.toISOString(),
                }),
              );
            }
          });
          expect(response.body).toEqual(expect.arrayContaining(expectationsYes));
          expect(response.body).toEqual(expect.not.arrayContaining(expectationsNo));
        })
        .end(done);
    });

    it(`should throw an error because of invalid tenant`, (done) => {
      const invalidTenantId = -137;

      request(app.getHttpServer())
        .get(`/tenant/${invalidTenantId}/close-reasons/internal`)
        .set('Accept', 'application/json')
        .set('X-TenantId', invalidTenantId.toString())
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
    await databaseHelper.cleanup();
    await app.close();
  });
});
