import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class AuthServiceErrors extends AppErrorBase {
  public static AuthError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static AuthUserDisabledError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static AuthRegisterError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static AuthActivateError: ErrorBaseConstructor<{message?: string} | null> = null as any;
}
