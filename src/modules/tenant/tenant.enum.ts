import {SalesForceCommands} from './../integrations/salesForce/salesForceIntegrationTypes';
import {InfoSystemCommands} from '../integrations/infoSystem/infoSystemIntegrationTypes';

export enum InvitationUrl {
  a = 'http://localhost:3001/invitation/invitationId?tenantId=$tenantId',
  d = 'https://was-eur-ww-dev-clientaccessfe.azurewebsites.net/invitation/invitationId?tenantId=$tenantId',
  t = 'https://was-eur-ww-test-clientaccessfe.azurewebsites.net/invitation/invitationId?tenantId=$tenantId',
  u = 'https://was-eur-ww-uat-clientaccessfe.azurewebsites.net/invitation/invitationId?tenantId=$tenantId',
}

export enum DestinationSystem {
  NONE = '',
  INFOCORE = 'Infocore',
  INFOEUROPE = 'Infoeurope',
  NAM = 'NAM', // representation of [SalesForce, BullHorn] systems
}

export type CustomAppProperties = {
  commandName: InfoSystemCommands | SalesForceCommands;
  destinationSystem: DestinationSystem;
};
