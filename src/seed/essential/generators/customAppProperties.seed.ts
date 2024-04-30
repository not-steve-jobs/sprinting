import {InfoSystemCommands} from '../../../modules/integrations/infoSystem/infoSystemIntegrationTypes';
import {CustomAppProperties, DestinationSystem} from '../../../modules/tenant/tenant.enum';

export const adeccoUsaCustomAppProperties: CustomAppProperties[] = [
  {
    commandName: InfoSystemCommands.createContact,
    destinationSystem: DestinationSystem.NAM,
  },
  {
    commandName: InfoSystemCommands.updateContact,
    destinationSystem: DestinationSystem.NAM,
  },
  {
    commandName: InfoSystemCommands.createPortalAccess,
    destinationSystem: DestinationSystem.NAM,
  },
  {
    commandName: InfoSystemCommands.updatePortalAccess,
    destinationSystem: DestinationSystem.NAM,
  },
  {
    commandName: InfoSystemCommands.createJob,
    destinationSystem: DestinationSystem.NAM,
  },
  {
    commandName: InfoSystemCommands.createJobSkills,
    destinationSystem: DestinationSystem.NAM,
  },
  {
    commandName: InfoSystemCommands.updateJobProcess,
    destinationSystem: DestinationSystem.NAM,
  },
];
