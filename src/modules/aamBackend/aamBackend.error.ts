import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class AamBackendError extends AppErrorBase {
  public static MissingAamBackendUrlCase: ErrorBaseConstructor<{urlCase?: string} | null> = null as any;
}
