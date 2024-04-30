import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class TenantUserInvitationServiceErrors extends AppErrorBase {
  public static InvitationIdAlreadyExistsError: ErrorBaseConstructor<{id: string}> = null;
  public static InvitationEmailAlreadyExistsError: ErrorBaseConstructor<{email: string}> = null;
  public static InvitationEmailAlreadyActiveError: ErrorBaseConstructor<{email: string}> = null;
  public static InvitationUserEmailAlreadyExistsError: ErrorBaseConstructor<{email: string}> = null;
  public static InvitationAlreadyUsedError: ErrorBaseConstructor<{id: string}> = null;
  public static InvitationEmailValidationFailedError: ErrorBaseConstructor<{id: string}> = null;
  public static InvitationExpiredError: ErrorBaseConstructor<{id: string}> = null;
  public static InvitationUserNotExistsError: ErrorBaseConstructor<{id: string}> = null;
}
