import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class ClientServiceErrors extends AppErrorBase {
  public static ClientCreateError: ErrorBaseConstructor<null> = null as any;
  public static ClientFetchError: ErrorBaseConstructor<null> = null as any;
}
