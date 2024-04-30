import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from 'src/lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class TenantError extends AppErrorBase {
  public static TenantServiceExistsError: ErrorBaseConstructor<void> = null;
  public static TenantServiceRetrieveError: ErrorBaseConstructor<{message?: string} | null> = null as any;
}
