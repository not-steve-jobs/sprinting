import {INestApplication} from '@nestjs/common';
import {FixInterface} from 'src/modules/fix/fix.interface';
import {LevelService} from 'src/modules/level/level.service';

export class RemoveNoneLevelFix1635939740000 implements FixInterface {
  public async execute(applicationInstance: INestApplication): Promise<any> {
    const levelService = applicationInstance.get(LevelService);
    await levelService.deleteLevels([15]);
  }
}
