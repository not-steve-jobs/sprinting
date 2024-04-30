import {INestApplication} from '@nestjs/common';
import {FixInterface} from 'src/modules/fix/fix.interface';
import {ProcessCommandFixesService} from '../../src/modules/integrations/infoSystem/fixes/processCommandFixes.service';
import {InfoSystemCommands} from '../../src/modules/integrations/infoSystem/infoSystemIntegrationTypes';

export class CommandCreateContactFix1625502763000 implements FixInterface {
  public async execute(applicationInstance: INestApplication): Promise<any> {
    const processCommandFixesService = applicationInstance.get(ProcessCommandFixesService);
    processCommandFixesService.fixedBy = __filename;
    await processCommandFixesService.processCommandFixByMessageName(InfoSystemCommands.createContact);
  }
}
