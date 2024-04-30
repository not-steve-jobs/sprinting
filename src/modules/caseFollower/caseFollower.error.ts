import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class CaseFollowerError extends AppErrorBase {
  public static CaseFollowerCreateError: ErrorBaseConstructor<null> = null as any;
  public static CaseFollowerFetchError: ErrorBaseConstructor<null> = null as any;
  public static CaseFollowerDeleteError: ErrorBaseConstructor<null> = null as any;
  public static CaseFollowerReadUpdateError: ErrorBaseConstructor<null> = null as any;
}
