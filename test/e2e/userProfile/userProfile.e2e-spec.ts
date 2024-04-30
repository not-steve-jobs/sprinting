import {INestApplication} from '@nestjs/common';
import {createTestNestApplication} from '../utils/helpers';
import {MainDatabaseHelper} from '../utils/seed';
import request from 'supertest';
import {testTenant} from '../tenant/data';
import {updateUserProfileRequest, testUserProfile} from './data';

describe('User Profile module', () => {
  let app: INestApplication;
  let databaseHelper;

  const tenantId = testTenant.id;
  const userId = testUserProfile.id;

  beforeAll(async () => {
    app = await createTestNestApplication({tenantId});

    databaseHelper = new MainDatabaseHelper();
  });

  afterAll(async () => {
    await databaseHelper.cleanup();
    await app.close();
  });

  describe('Get user profile: GET /tenant/:tenantId/user/:userId/user-profile', () => {
    it('should return userProfile for the specified user when wrong tenantId provided', (done) => {
      const wrongTenantId = 123456789;
      request(app.getHttpServer())
        .get(`/tenant/${wrongTenantId}/user/${userId}/user-profile`)
        .set('Accept', 'application/json')
        .set('X-TenantId', wrongTenantId.toString())
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

    it('should return error when wrong userId provided', (done) => {
      const wrongUserId = '12345678-0000-4000-0000-000000000077';
      request(app.getHttpServer())
        .get(`/tenant/${testTenant}/user/${wrongUserId}/user-profile`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
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

    // TODO: This test is dependant by the changes of some other test, if you run them twice it will fail the second time which is wrong
    it.skip('should return userProfile for the specified user', (done) => {
      request(app.getHttpServer())
        .get(`/tenant/${tenantId}/user/${userId}/user-profile`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...testUserProfile,
            createdAt: testUserProfile.createdAt.toISOString(),
            updatedAt: testUserProfile.updatedAt.toISOString(),
          });
        })
        .end(done);
    });
  });

  describe('Update user profile: PUT /tenant/:tenantId/user/:userId/user-profile', () => {
    it('should return error when wrong tenantId provided', (done) => {
      const wrongTenantId = 123456789;
      request(app.getHttpServer())
        .put(`/tenant/${wrongTenantId}/user/${userId}/user-profile`)
        .set('Accept', 'application/json')
        .set('X-TenantId', wrongTenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          ...updateUserProfileRequest,
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

    it('should return error when wrong userId provided', (done) => {
      const wrongUserId = '12345678-0000-4000-0000-000000000077';
      request(app.getHttpServer())
        .put(`/tenant/${tenantId}/user/${wrongUserId}/user-profile`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          ...updateUserProfileRequest,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'UserProfileUpdateError',
            },
          });
        })
        .end(done);
    });

    it('should return error when wrong data provided', (done) => {
      request(app.getHttpServer())
        .put(`/tenant/${tenantId}/user/${userId}/user-profile`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          ...updateUserProfileRequest,
          mainLocationId: '12345678-0000-4000-0000-133333333333',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'UserProfileUpdateError',
            },
          });
        })
        .end(done);
    });

    // TODO: This tests is corrupting the data used in other test. It should be reworked to use a separate user which should be updated
    // Note: Run the tests twice and you'll see that the second time will fail the GET UserProfile test, because the data is not the same
    it.skip('should update user profile', (done) => {
      request(app.getHttpServer())
        .put(`/tenant/${tenantId}/user/${userId}/user-profile`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          ...updateUserProfileRequest,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...updateUserProfileRequest,
            department: {
              ...updateUserProfileRequest.department,
              createdAt: updateUserProfileRequest.department.createdAt.toISOString(),
              updatedAt: updateUserProfileRequest.department.updatedAt.toISOString(),
            },
            departmentFunction: {
              ...updateUserProfileRequest.departmentFunction,
              createdAt: updateUserProfileRequest.departmentFunction.createdAt.toISOString(),
              updatedAt: updateUserProfileRequest.departmentFunction.updatedAt.toISOString(),
              department: {
                ...updateUserProfileRequest.departmentFunction.department,
                createdAt: updateUserProfileRequest.departmentFunction.department.createdAt.toISOString(),
                updatedAt: updateUserProfileRequest.departmentFunction.department.updatedAt.toISOString(),
              },
            },
          });
        })
        .end(done);
    });
  });

  describe('Save user preferences: POST /tenant/:tenantId/user/:userId/user-profile/preferences', () => {
    it('should return error when wrong tenantId provided', (done) => {
      const wrongTenantId = 123456789;
      request(app.getHttpServer())
        .post(`/tenant/${wrongTenantId}/user/${userId}/user-profile/preferences`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          isJobOrderChartShown: true,
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

    it('should return error when wrong userId provided', (done) => {
      const wrongUserId = '12345678-0000-4000-0000-000000000077';
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/user/${wrongUserId}/user-profile/preferences`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          isJobOrderChartShown: true,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'UserProfileUpdatePreferencesError',
            },
          });
        })
        .end(done);
    });

    // TODO This test depends on the data which was result of the UPDATE UserProfile test which is wrong, the tests should be independent
    it.skip('should provide valid data and get response', (done) => {
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/user/${userId}/user-profile/preferences`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          isJobOrderChartShown: true,
        })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...testUserProfile,
            firstName: updateUserProfileRequest.firstName,
            lastName: updateUserProfileRequest.lastName,
            phonePrefix: updateUserProfileRequest.phonePrefix,
            phone: updateUserProfileRequest.phone,
            otherPhonePrefix: updateUserProfileRequest.otherPhonePrefix,
            otherPhone: updateUserProfileRequest.otherPhone,
            language: updateUserProfileRequest.language,
            worksite: updateUserProfileRequest.worksite,
            title: updateUserProfileRequest.title,
            createdAt: testUserProfile.createdAt.toISOString(),
            // TODO: the updatedAt changes when the test above works when we update the userProfile and does not conform to the updatedAt of testData
            updatedAt: response.body.updatedAt,
            preferences: {
              isJobOrderChartShown: true,
            },
          });
        })
        .end(done);
    });
  });
});
