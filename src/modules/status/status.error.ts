import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class StatusError extends AppErrorBase {
  public static StatusServiceNotFound: ErrorBaseConstructor<{id: number; name: string}> = null as any;
}
