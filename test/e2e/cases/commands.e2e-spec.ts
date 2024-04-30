import request from 'supertest';
import {INestApplication} from '@nestjs/common';
import {getCustomRepository} from 'typeorm';

import {Case} from 'src/modules/case/case.entity';

import {MainDatabaseHelper} from '../utils/seed';
import {createTestNestApplication} from '../utils/helpers';

import {testCommandCase} from './data';
import {testUser} from '../users/data';

import {BusMessageRepository} from '../../../src/modules/busMessage/busMessage.repository';
import {BusMessageStatusEnum, BusMessageTypeEnum} from '../../../src/modules/busMessage/busMessage.enum';
import {InfoSystemOutputService} from '../../../src/modules/integrations/infoSystem/infoSystemOutput.service';
import {InfoSystemErrorService} from '../../../src/modules/integrations/infoSystem/infoSystemError.service';
import {createClientCaseCommandError, createClientCaseCommandResponse} from './message';
import {BusMessage} from '../../../src/modules/busMessage/busMessage.entity';
import {CaseDto} from '../../../src/modules/case/dto/case.dto';
import {CreateClientCaseData} from '../../../src/modules/integrations/infoSystem/commandModels/createClientCaseData';

describe('Cases commands', () => {
  // Test instance of the Nest.js application used to execute the real API endpoints
  let app: INestApplication;

  // The Tenant ID which we use in the tests bellow
  const tenantId: number = 137;

  // Custom helper class which provides some functions for easier interaction with the database
  let databaseHelper;

  // Store created case for use in other tests
  let createdCase: CaseDto;

  // createClientCase command message
  let createClientCaseCommand: BusMessage;

  beforeAll(async () => {
    process.env.INFO_INTEGRATION_COMMANDS_ENABLED = 'true';

    app = await createTestNestApplication({tenantId});

    databaseHelper = new MainDatabaseHelper();
  });

  // Handler for createClientCase command and responses
  // TODO: The tests are no longer passing due to some changes in the commands payload, fix them
  describe.skip('COMMAND createClientCase', () => {
    it(`should create a new Case with provided minimum set of data and return details for the new record`, (done) => {
      const newTestCase: Partial<Case> = {
        tenantId: testCommandCase.tenantId,
        entityName: testCommandCase.entityName,
        subject: 'Test Command Subject',
        description: 'Test Command Description.',
        // statusId: testCase.statusId, // TODO: Get the real status
        caseCategoryId: testCommandCase.caseCategoryId,
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

    it(`verify command data`, async () => {
      expect(createdCase.id).toBeDefined();
      const busMessageRepo = getCustomRepository(BusMessageRepository);
      expect(busMessageRepo).toBeDefined();

      const cmdPayload: Partial<CreateClientCaseData> = {
        caseId: createdCase.id,
      };

      createClientCaseCommand = await busMessageRepo.findOneByMessageNameAndPayload('createClientCase', cmdPayload);

      expect(createClientCaseCommand).toBeDefined();
      expect(createClientCaseCommand.status).toEqual(BusMessageStatusEnum.CREATED);

      const {
        subject,
        category,
        entityId,
        createdBy,
        locationId,
        description,
      } = createClientCaseCommand.payload.body.parameters;

      expect(createdCase).toEqual(
        expect.objectContaining({
          subject,
          caseCategoryId: category,
          entityId,
          createdBy,
          locationId,
          description,
        }),
      );
    });

    it(`verify command success response`, async () => {
      expect(createClientCaseCommand.messageId).toBeDefined();
      createClientCaseCommandResponse.CommandId = createClientCaseCommand.messageId;

      const infoSystemOutputService = app.get(InfoSystemOutputService);
      await infoSystemOutputService.onMessage({body: createClientCaseCommandResponse});

      const busMessageRepo = getCustomRepository(BusMessageRepository);
      const busMessageResponse = await busMessageRepo.findOneByMessageIdAndType(
        createClientCaseCommand.messageId,
        BusMessageTypeEnum.COMMANDSUCCESS,
      );

      expect(busMessageResponse).toBeDefined();
      expect(busMessageResponse.status).toEqual(BusMessageStatusEnum.RECEIVED);

      const busMessage = await busMessageRepo.findOneByMessageIdAndType(
        createClientCaseCommand.messageId,
        BusMessageTypeEnum.COMMAND,
      );
      expect(busMessage).toBeDefined();
      expect(busMessage.status).toEqual(BusMessageStatusEnum.SUCCESS);
    });

    it(`verify command error response`, async () => {
      expect(createClientCaseCommand.messageId).toBeDefined();
      createClientCaseCommandError.commandId = createClientCaseCommand.messageId;

      const infoSystemOutputService = app.get(InfoSystemErrorService);
      await infoSystemOutputService.onMessage({body: createClientCaseCommandError});

      const busMessageRepo = getCustomRepository(BusMessageRepository);
      const busMessageError = await busMessageRepo.findOneByMessageIdAndType(
        createClientCaseCommand.messageId,
        BusMessageTypeEnum.COMMANDERROR,
      );

      expect(busMessageError).toBeDefined();
      expect(busMessageError.status).toEqual(BusMessageStatusEnum.RECEIVED);

      const busMessage = await busMessageRepo.findOneByMessageIdAndType(
        createClientCaseCommand.messageId,
        BusMessageTypeEnum.COMMAND,
      );
      expect(busMessage).toBeDefined();
      expect(busMessage.status).toEqual(BusMessageStatusEnum.ERROR);
    });
  });

  afterAll(async () => {
    // TODO: Deal with the Redis connection, for some reason it's not closing successfully and the tests cannot exit
    await databaseHelper.cleanup();
    await app.close();
  });
});
