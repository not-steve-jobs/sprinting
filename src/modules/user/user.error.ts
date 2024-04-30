import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class UserServiceErrors extends AppErrorBase {
  public static UserEmailAlreadyRegistered: ErrorBaseConstructor<{email: string}> = null;
  public static UserEmailAlreadyExists: ErrorBaseConstructor<{email: string}> = null;
  public static UserEmailChangeForActiveUser: ErrorBaseConstructor<{email: string}> = null;
  public static UserNotExists: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static UserCreateError: ErrorBaseConstructor<null> = null as any;
  public static UserUpdateError: ErrorBaseConstructor<null> = null as any;
  public static UserDisableError: ErrorBaseConstructor<null> = null as any;
  public static UserAuthError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static UserFetchColleaguesError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static UserFetchColleaguesAggregateError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static UserInconsistentDepartmentFunction: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static UserPrepareUpdatePortalAccessCommandError: ErrorBaseConstructor<null> = null as any;
}
