import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class TenantUserLocationError extends AppErrorBase {
  public static UserLocationUserLocationsError: ErrorBaseConstructor<null> = null as any;
  public static UserLocationUpsertError: ErrorBaseConstructor<null> = null as any;
}
