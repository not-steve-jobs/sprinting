import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class PermissionError extends AppErrorBase {
  public static PermissionsFetchError: ErrorBaseConstructor<null> = null as any;
}
