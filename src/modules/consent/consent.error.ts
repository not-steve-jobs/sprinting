import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class ConsentError extends AppErrorBase {
  public static ConsentNotFound: ErrorBaseConstructor<{id: string; name: string}> = null as any;
  public static ConsentByTypeNotFound: ErrorBaseConstructor<{type: string; name: string}> = null as any;
}
