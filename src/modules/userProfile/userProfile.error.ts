import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class UserProfileError extends AppErrorBase {
  public static UserProfileDoesNotExistError: ErrorBaseConstructor<{id?: string} | null> = null as any;
  public static UserProfileAccessDeniedError: ErrorBaseConstructor<null> = null as any;
  public static UserProfileUpdateError: ErrorBaseConstructor<null> = null as any;
  public static UserProfileUpdatePreferencesError: ErrorBaseConstructor<null> = null as any;
  public static UserProfileGetError: ErrorBaseConstructor<null> = null as any;
  public static UserProfileFetchError: ErrorBaseConstructor<null> = null as any;
  public static UserProfileInconsistentDepartmentFunction: ErrorBaseConstructor<null> = null as any;
}
