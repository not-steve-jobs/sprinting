import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class TenantUserPermissionError extends AppErrorBase {
  public static UserPermissionUserPermissionsError: ErrorBaseConstructor<null> = null as any;
}
