import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class BusMessageError extends AppErrorBase {
  public static BusMessageCreateError: ErrorBaseConstructor<null> = null as any;
}
