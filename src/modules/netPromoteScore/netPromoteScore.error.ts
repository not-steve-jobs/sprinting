import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class NetPromoteScoreError extends AppErrorBase {
  public static NetPromoteScoreCreateError: ErrorBaseConstructor<null> = null as any;
}
