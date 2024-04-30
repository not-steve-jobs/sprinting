import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class CaseError extends AppErrorBase {
  public static CaseCreateError: ErrorBaseConstructor<null> = null as any;
  public static CaseFetchError: ErrorBaseConstructor<null> = null as any;
}
