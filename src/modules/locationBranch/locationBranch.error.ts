import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class LocationBranchError extends AppErrorBase {
  public static LocationBranchGetAllError: ErrorBaseConstructor<null> = null as any;
  public static LocationBranchCreateError: ErrorBaseConstructor<null> = null as any;
}
