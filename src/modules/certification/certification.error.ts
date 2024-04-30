import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class CertificationErrors extends AppErrorBase {
  public static CertificationErrorFetchError: ErrorBaseConstructor<null> = null as any;
}
