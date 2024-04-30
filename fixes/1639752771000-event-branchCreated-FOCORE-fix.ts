import {FixInterface} from 'src/modules/fix/fix.interface';
import {INestApplication} from '@nestjs/common';
import {InfoSystemEvents} from './../src/modules/integrations/infoSystem/infoSystemIntegrationTypes';
import {ProcessFoCoreBranchCreatedService} from './../src/modules/integrations/infoSystem/fixes/processFoCoreBranchCreatedEvents.service';

export class EventBranchCreatedFoCoreFix1639752771000 implements FixInterface {
  public async execute(applicationInstance: INestApplication): Promise<any> {
    const processFoCoreBranchCreatedService = applicationInstance.get(ProcessFoCoreBranchCreatedService);
    processFoCoreBranchCreatedService.fixedBy = __filename;
    await processFoCoreBranchCreatedService.processEventFix(InfoSystemEvents.branchCreated);
  }
}
