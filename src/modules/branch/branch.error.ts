import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class BranchError extends AppErrorBase {
  public static BranchCreateError: ErrorBaseConstructor<null> = null as any;
  public static BranchFetchError: ErrorBaseConstructor<null> = null as any;
}
