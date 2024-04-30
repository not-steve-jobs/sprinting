import {INestApplication} from '@nestjs/common';
import {PermissionService} from 'src/modules/permission/permission.service';
import request from 'supertest';

import {testTenant} from '../tenant/data';
import {createTestNestApplication} from '../utils/helpers';
import {MockMethodEnum, MockProviderOptions} from '../utils/mock.helpers';
import {MainDatabaseHelper} from '../utils/seed';

import {testPermission} from './data';
import {MockedPermissionService} from './mock';

describe('Permissions', () => {
  // Test instance of the Nest.js application used to execute the real API endpoints
  let app: INestApplication;
  // The Tenant ID which we use in the tests bellow
  const tenantId: number = testTenant.id;
  // Custom helper class which provides some functions for easier interaction with the database
  let databaseHelper;
  // Define the mock providers which we use for overriding some of the default module providers(services e.t.c)
  const mockProviders: MockProviderOptions[] = [
    {
      provider: PermissionService,
      mockMethod: MockMethodEnum.UseClass,
      mockedProvider: MockedPermissionService,
    },
  ];

  beforeAll(async () => {
    app = await createTestNestApplication({tenantId, mockProviders});
    databaseHelper = new MainDatabaseHelper();
  });

  // Handler for getting permissions
  describe('GET /api/tenant/:tenantId/all-permissions', () => {
    it(`should return list of permissions for the specified tenant`, (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/all-permissions/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body).toContainObject({
            ...testPermission,
            createdAt: testPermission.createdAt.toISOString(),
            updatedAt: testPermission.updatedAt.toISOString(),
          });
        })
        .end(done);
    });

    // Note: Currently the error is not handled in the business logic, so the test is pending until we fix this
    xit(`should throw an error because of invalid tenant in the header`, (done) => {
      const invalidTenantId = '123456789';

      request(app.getHttpServer())
        .get(`/roles`)
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
