import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class CloseReasonArgumentsError extends AppErrorBase {
  public static CloseReasonArgumentsCreateError: ErrorBaseConstructor<null> = null as any;
}
