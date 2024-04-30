import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class CommonError extends AppErrorBase {
  public static CommonServiceIntentionalError: ErrorBaseConstructor<void> = null as any;
}
