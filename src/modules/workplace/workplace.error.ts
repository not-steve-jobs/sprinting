import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class WorkplaceError extends AppErrorBase {
  public static WorkplaceCreateError: ErrorBaseConstructor<null> = null as any;
}
