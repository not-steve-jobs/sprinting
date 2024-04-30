import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class UserConsentServiceErrors extends AppErrorBase {
  public static UserConsentCreateError: ErrorBaseConstructor<{message?: string}> = null as any;
}
