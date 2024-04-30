import {INestApplication} from '@nestjs/common';
import {FixInterface} from 'src/modules/fix/fix.interface';
import {JobRoleService} from 'src/modules/jobRole/jobRole.service';
import {intGuid} from 'src/seed/utils/seed.utils';

export class RemoveOldJobRolesFix1635163650000 implements FixInterface {
  public async execute(applicationInstance: INestApplication): Promise<any> {
    const jobRoleIds = [
      intGuid(37),
      intGuid(38),
      intGuid(39),
      intGuid(40),
      intGuid(41),
      intGuid(42),
      intGuid(43),
      intGuid(44),
      intGuid(45),
    ];
    const jobRoleService = applicationInstance.get(JobRoleService);
    await jobRoleService.deleteRoles(137, jobRoleIds);
  }
}
