import {INestApplication} from '@nestjs/common';
import {createTestNestApplication, getTestUser} from '../utils/helpers';
import {MainDatabaseHelper} from '../utils/seed';
import request from 'supertest';
import {createUserResponse, testChangedUser, testUser} from './data';
import {testClient} from '../clients/data';
import {DisableUserOrigin} from 'src/modules/user/user.enum';
import {testTenant} from '../tenant/data';
import {testTenantUser} from '../tenantUser/data';
import {testRole} from '../role/data';

describe('User module', () => {
  let app: INestApplication;
  let userData: any;
  let databaseHelper;

  const tenantId = testTenant.id;

  beforeAll(async () => {
    app = await createTestNestApplication({tenantId});
    userData = await getTestUser();

    databaseHelper = new MainDatabaseHelper();
  });

  afterAll(async () => {
    await databaseHelper.cleanup();
    await app.close();
  });

  // TODO: while adding a new user in test many relations are created with user id and there issue while cleanup, need some research about it
  describe.skip('Create user: POST /tenant/:tenantId/user/create', () => {
    xit('should return error when wrong tenantId provided', (done) => {
      const wrongTenantId = 999;
      const tenantId = wrongTenantId;
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/user/create`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-type', /json/)
        .send({})
        .expect(400)
        .expect((response) => {
          databaseHelper.addCreatedRecord('User', response.body.id);
        })
        .end(done);
    });

    xit('should return error when wrong data provided', (done) => {
      const wrongData = {};
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/user/create`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-type', /json/)
        .send({...wrongData})
        .expect(400)
        .expect((response) => {
          databaseHelper.addCreatedRecord('User', response.body.id);
        })
        .end(done);
    });

    xit('should create user', (done) => {
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/user/create`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-type', /json/)
        .send({...createUserResponse})
        .expect(200)
        .expect((response) => {
          databaseHelper.addCreatedRecord('User', response.body.id);
        })
        .end(done);
    });
  });

  describe('Update user: PATCH /tenant/:tenantId/user/:userId', () => {
    it('should return error when wrong tenantId provided', (done) => {
      const wrongTenantId = 999;
      const tenantId = wrongTenantId;
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${testUser.id}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          ...testChangedUser,
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
      const wrongUserId = '00000000-0000-4000-0000-000000777777';
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${wrongUserId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          ...testChangedUser,
          userId: wrongUserId,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'UserCreateError',
            },
          });
        })
        .end(done);
    });

    // TODO: This tests created data which is not cleaned up properly after the execution of the suite
    // Note: Make sure you schedule for deletion the created TenantUserLocation so it can be automatically cleaned up by the database helper
    it.skip('should update user', (done) => {
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${testUser.id}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          ...testChangedUser,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            tenantId: testTenant.id,
            userId: testUser.id,
            roleId: testRole.id,
            // statusId: testUserStatus.id, // TODO; Fix this?
            user: {
              id: testUser.id,
              clientId: testClient.id,
              B2CId: testUser.B2CId,
              email: testUser.email,
              userProfile: {
                id: testUser.id,
                mainLocationId: testChangedUser.personalInformation.mainLocationId,
                firstName: testChangedUser.personalInformation.firstName,
                lastName: testChangedUser.personalInformation.lastName,
                phonePrefix: testChangedUser.personalInformation.phonePrefix,
                phone: testChangedUser.personalInformation.phone,
                otherPhonePrefix: testChangedUser.personalInformation.otherPhonePrefix,
                otherPhone: testChangedUser.personalInformation.otherPhone,
                title: testChangedUser.personalInformation.title,
                departmentId: testChangedUser.personalInformation.department,
                departmentFunctionId: testChangedUser.personalInformation.departmentFunction,
              },
            },
          });
        })
        .end(done);
    });
  });

  // TODO: Fix those tests, they're not passing
  describe.skip('Disable user: PATCH /tenant/:tenantId/user/:userId/disable', () => {
    const disablePatchData = {
      disableReason: 'New Position',
      origin: DisableUserOrigin.CLP_USER,
    };

    it('should return error when wrong tenantId provided', (done) => {
      const wrongTenantId = 999;
      const tenantId = wrongTenantId;
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${testUser.id}/disable`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({...disablePatchData})
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
      const wrongUserId = '00000000-0000-4000-0000-000000777777';
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${wrongUserId}/disable`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({...disablePatchData})
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

    it('should return error when wrong data provided', (done) => {
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${testUser.id}/disable`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          ...disablePatchData,
          origin: 7777,
        })
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

    it('should disable user', (done) => {
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${testUser.id}/disable`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({...disablePatchData})
        .expect(200)
        .expect((response) => {
          expect(response.body.tenant).toMatchObject({
            ...testTenant,
            isActive: false,
          });
        })
        .end(done);
    });
  });

  // TODO: Fix those tests, they're not passing
  describe.skip('Enable user: PATCH /tenant/:tenantId/user/:userId/enable', () => {
    it('should return error when wrong tenantId provided', (done) => {
      const wrongTenantId = 999;
      const tenantId = wrongTenantId;
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${testUser.id}/enable`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          enabledByUserId: testUser.id,
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
      const wrongUserId = '00000000-0000-4000-0000-000000777777';
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${wrongUserId}/enable`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          enabledByUserId: testUser.id,
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

    it('should return error when wrong data provided', (done) => {
      const wrongUserId = '00000000-0000-4000-0000-000000777777';
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${testUser.id}/enable`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          enabledByUserId: wrongUserId,
        })
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

    it('should enable user', (done) => {
      request(app.getHttpServer())
        .patch(`/tenant/${tenantId}/user/${testUser.id}/enable`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          enabledByUserId: testUser.id,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body.tenantUser).toMatchObject({
            ...testTenantUser,
          });
        })
        .end(done);
    });
  });

  // TODO: PUT API endpoint accepts only the email property, need to create a Tech Debt
  describe.skip('Update user properties: PUT /user/:userId', () => {
    it('should return error when wrong userId provided', (done) => {
      const wrongUserId = '00000000-0000-4000-0000-000000777777';
      request(app.getHttpServer())
        .put(`/user/${wrongUserId}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          email: userData.email,
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

    it('should return error when wrong data provided', (done) => {
      request(app.getHttpServer())
        .put(`/user/${testUser.id}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          email: 'wrong@adeccogroup.com',
        })
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

    it('should update user properties', (done) => {
      request(app.getHttpServer())
        .put(`/user/${testUser.id}`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({email: userData.email})
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            email: userData.email,
          });
        })
        .end(done);
    });
  });

  // TODO: for finding colleagues by status need to other user that user.id !== currentUser.id
  describe.skip('Get colleagues by status: POST /tenant/:tenantId/user/:userId/my-colleagues-status', () => {
    const getColleaguesData = {
      findBetween: [
        {
          key: 'dateStart',
          from: '2018-02-18T12:54:24+01:00',
          to: '2022-02-18T12:54:00+01:00',
        },
      ],
    };

    xit('should return error when wrong tenantId provided', (done) => {
      const wrongTenantId = 999;
      const tenantId = wrongTenantId;
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/user/${testUser.id}/my-colleagues-status`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({...getColleaguesData})
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

    xit('should return error when wrong userId provided', (done) => {
      const wrongUserId = '00000000-0000-4000-0000-000000777777';
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/user/${wrongUserId}/my-colleagues-status`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({...getColleaguesData})
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 400,
            error: {
              name: 'UserFetchColleaguesAggregateError',
            },
          });
        })
        .end(done);
    });

    xit('should return error when wrong data provided', (done) => {
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/user/${testUser.id}/my-colleagues-status`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({})
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

    xit('should get colleagues by status', (done) => {
      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/user/${'00000000-0000-4000-0000-000000000005'}/my-colleagues-status`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({...getColleaguesData})
        .expect(201)
        .expect((response) => {
          expect(response.body).toBeTruthy();
        })
        .end(done);
    });
  });

  describe('Get all users: GET /clientId/:clientId/user', () => {
    // TODO: Fix this test
    // Expected: {"error": {"name": "EntityNotFoundError"}, "status": 400}
    // Received: []
    it.skip('should return error when wrong clientId provided', (done) => {
      const wrongClientId = '12345678-4444-4444-4444-444444444441';
      request(app.getHttpServer())
        .get(`/clientId/${wrongClientId}/user`)
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

    // TODO: This test is dependant on the changes performed by another test which is wrong
    it.skip('should get all users', (done) => {
      request(app.getHttpServer())
        .get(`/clientId/${testClient.id}/user`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          const expectedResult = {
            id: testUser.id,
            fullName: `${testChangedUser.personalInformation.firstName} ${testChangedUser.personalInformation.lastName}`,
          };
          expect(response.body).toContainObject(expectedResult);
        })
        .end(done);
    });
  });
});
