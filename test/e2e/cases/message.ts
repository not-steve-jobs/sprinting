import {v4 as uuid} from 'uuid';

import {
  ClientCaseUpdatedData,
  InfoSystemErrorResponse,
  InfoSystemEvent,
  InfoSystemResponse,
} from '../../../src/modules/integrations/infoSystem/eventModels';
import {testCaseUpdateStatus} from '../status/data';
import {testTenant} from '../tenant/data';

export const clientCaseUpdateEvent: InfoSystemEvent<ClientCaseUpdatedData> = {
  brand: testTenant.brand,
  country: 'CH',
  eventId: uuid(),
  eventName: 'clientCaseUpdated',
  parameters: {
    caseId: uuid(),
    status: testCaseUpdateStatus.id.toString(),
  },
};

export const createClientCaseCommandResponse: InfoSystemResponse = {
  Data: 'Success',
  Success: true,
  CommandId: uuid(),
  CommandName: 'createClientCase',
};

export const createClientCaseCommandError: InfoSystemErrorResponse = {
  brand: testTenant.brand,
  country: 'CH',
  commandId: uuid(),
  parameters: {
    data: 'The operation was canceled.',
    success: false,
  },
  commandName: 'createClientCase',
  errorOriginSystem: 'info',
};
