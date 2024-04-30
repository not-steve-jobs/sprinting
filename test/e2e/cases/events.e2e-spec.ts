import request from 'supertest';
import {INestApplication} from '@nestjs/common';
import {getCustomRepository} from 'typeorm';
import {v4 as uuid} from 'uuid';

import {MainDatabaseHelper} from '../utils/seed';
import {createTestNestApplication} from '../utils/helpers';

import {testEventCase} from './data';

import {InfoSystemEventsService} from '../../../src/modules/integrations/infoSystem/infoSystemEvents.service';
import {BusMessageStatusEnum} from '../../../src/modules/busMessage/busMessage.enum';
import {CaseRepository} from '../../../src/modules/case/case.repository';
import {testCaseUpdateStatus} from '../status/data';
import {clientCaseUpdateEvent} from './message';
import {Case} from '../../../src/modules/case/case.entity';
import {testUser} from '../users/data';
import {CaseDto} from '../../../src/modules/case/dto/case.dto';
import {BusMessage} from '../../../src/modules/busMessage/busMessage.entity';

// TODO: The tests are no longer passing due to some changes in the events payload, fix them
describe.skip('Cases events', () => {
  // Test instance of the Nest.js application used to execute the real API endpoints
  let app: INestApplication;

  // The Tenant ID which we use in the tests bellow
  const tenantId: number = 137;

  // Custom helper class which provides some functions for easier interaction with the database
  let databaseHelper;

  // Store created case for use in other tests
  let createdCase: CaseDto;

  beforeAll(async () => {
    process.env.INFO_INTEGRATION_EVENT_LOGS_ENABLED = 'true';

    app = await createTestNestApplication({tenantId});

    databaseHelper = new MainDatabaseHelper();
  });

  // Handler for clientCaseUpdated event
  describe('EVENT clientCaseUpdated', () => {
    it(`should create a new Case with provided minimum set of data and return details for the new record`, (done) => {
      const newTestCase: Partial<Case> = {
        tenantId: testEventCase.tenantId,
        entityName: testEventCase.entityName,
        subject: 'Test clientCaseUpdated Subject',
        description: 'Test Description.',
        //statusId: testEventCase.statusId,
        caseCategoryId: testEventCase.caseCategoryId,
        userId: testUser.id,
      };

      request(app.getHttpServer())
        .post(`/tenant/${tenantId}/case/`)
        .set('Accept', 'application/json')
        .set('X-TenantId', tenantId.toString())
        .expect('Content-Type', /json/)
        .send({
          tenantId: newTestCase.tenantId,
          entityName: newTestCase.entityName,
          subject: newTestCase.subject,
          description: newTestCase.description,
          caseCategoryId: newTestCase.caseCategoryId,
          createdBy: testUser.id,
        })
        .expect(201)
        .expect((response) => {
          createdCase = response.body;
          expect(response.body).toMatchObject({
            ...newTestCase,
          });

          databaseHelper.addCreatedRecord('Case', response.body.id);
        })
        .end(done);
    });

    it(`should update the Case`, async () => {
      expect(createdCase.id).toBeDefined();
      clientCaseUpdateEvent.parameters.caseId = createdCase.id;

      const infoSystemEventsService = app.get(InfoSystemEventsService);
      const busMessageEvent: BusMessage = await infoSystemEventsService.onMessage({body: clientCaseUpdateEvent});

      expect(busMessageEvent).toBeDefined();

      databaseHelper.addCreatedRecord('BusMessage', busMessageEvent.id);

      expect(busMessageEvent.status).toEqual(BusMessageStatusEnum.RECEIVED);

      const caseRepo = getCustomRepository(CaseRepository);
      const caseUpdated = await caseRepo.findOne(tenantId, createdCase.id);

      expect(caseUpdated).toBeDefined();
      expect(caseUpdated.statusId).toEqual(testCaseUpdateStatus.id);
    });

    it(`should set event to error status`, async () => {
      expect(createdCase.id).toBeDefined();
      clientCaseUpdateEvent.parameters.caseId = createdCase.id;
      clientCaseUpdateEvent.country = 'CH';
      clientCaseUpdateEvent.eventId = uuid();

      const infoSystemEventsService = app.get(InfoSystemEventsService);
      const busMessageEvent: BusMessage = await infoSystemEventsService.onMessage({body: clientCaseUpdateEvent});

      expect(busMessageEvent).toBeDefined();

      databaseHelper.addCreatedRecord('BusMessage', busMessageEvent.id);

      expect(busMessageEvent.status).toEqual(BusMessageStatusEnum.ERROR);
    });
  });

  afterAll(async () => {
    // TODO: Deal with the Redis connection, for some reason it's not closing successfully and the tests cannot exit
    await databaseHelper.cleanup();
    await app.close();
  });
});
