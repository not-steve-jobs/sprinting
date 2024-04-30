import {ErrorList} from '../error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class PermissionError extends AppErrorBase {
  public static PermissionUserContextNotFound: ErrorBaseConstructor<void> = null as any;
  public static PermissionUserContextInfoNotFound: ErrorBaseConstructor<void> = null as any;
  public static PermissionUserIdNotFound: ErrorBaseConstructor<void> = null as any;
  public static PermissionTenantIdNotFound: ErrorBaseConstructor<void> = null as any;
  public static PermissionNameNotFound: ErrorBaseConstructor<void> = null as any;
  public static PermissionActionNotFound: ErrorBaseConstructor<void> = null as any;
  public static PermissionRequired: ErrorBaseConstructor<string | null | undefined> = null as any;
  public static PermissionRequiredGuardError: ErrorBaseConstructor<void> = null as any;
}
