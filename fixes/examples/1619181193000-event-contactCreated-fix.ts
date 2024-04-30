import {FixInterface} from 'src/modules/fix/fix.interface';
import {INestApplication} from '@nestjs/common';
import {InfoSystemEvents} from '../../src/modules/integrations/infoSystem/infoSystemIntegrationTypes';
import {ProcessEventFixesService} from '../../src/modules/integrations/infoSystem/fixes/processEventFixes.service';

export class EventContactCreatedFix1619181193000 implements FixInterface {
  public async execute(applicationInstance: INestApplication): Promise<any> {
    const processEventFixesService = applicationInstance.get(ProcessEventFixesService);
    processEventFixesService.fixedBy = __filename;
    await processEventFixesService.processEventFixByMessageName(InfoSystemEvents.contactCreated);
  }
}
