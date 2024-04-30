import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class LocationError extends AppErrorBase {
  public static LocationsFetchError: ErrorBaseConstructor<null> = null as any;
  public static LocationCreateError: ErrorBaseConstructor<null> = null as any;
  public static LocationUpdateError: ErrorBaseConstructor<null> = null as any;
  public static GoogleApiError: ErrorBaseConstructor<null> = null as any;
}
