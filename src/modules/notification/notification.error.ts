import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class NotificationError extends AppErrorBase {
  public static NotificationFetchError: ErrorBaseConstructor<null> = null as any;
  public static NotificationSaveError: ErrorBaseConstructor<null> = null as any;
  public static NotificationSaveManyError: ErrorBaseConstructor<null> = null as any;
  public static NotificationDeleteManyError: ErrorBaseConstructor<null> = null as any;
  public static NotificationReadError: ErrorBaseConstructor<null> = null as any;
}
