import {INestApplication} from '@nestjs/common';
import {FixInterface} from 'src/modules/fix/fix.interface';
import {Logger} from 'src/core/logger';
import { TenantUserPermissionRepository } from 'src/modules/tenantUserPermission/tenantUserPermission.repository';
import { PermissionRepository } from 'src/modules/permission/permission.repository';

export class TenantPermissions1646935372000 implements FixInterface {
  public async execute(applicationInstance: INestApplication, logger?: Logger): Promise<any> {
    const tenantUserPermissionRepository = applicationInstance.get(TenantUserPermissionRepository);
    const tenantPermissionRepository = applicationInstance.get(PermissionRepository);

    tenantUserPermissionRepository.deleteMultiplePermissionsByTenantId(
      '137',
      ['00000000-0000-4000-0000-000000000022', '00000000-0000-4000-0000-000000000023']
    );
    tenantPermissionRepository.deleteMultiplePermissionsByTenantId(
      '137',
      ['00000000-0000-4000-0000-000000000022', '00000000-0000-4000-0000-000000000023']
    );

    logger.info(__filename, `Done. Fix applied on Permission and TenantUserPermission!`);
  }
}
