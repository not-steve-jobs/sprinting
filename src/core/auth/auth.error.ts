import {ErrorList} from '../error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class AuthError extends AppErrorBase {
  public static AuthHeaderNoBearerError: ErrorBaseConstructor<{headerName: string}> = null as any;
  public static AuthTokenUndecodablePayloadError: ErrorBaseConstructor<{headerName: string}> = null as any;
  public static AuthTokenNoIssuerError: ErrorBaseConstructor<{headerName: string}> = null as any;
  public static AuthTokenUnknownIssuerError: ErrorBaseConstructor<{headerName: string}> = null as any;
  public static AuthTokenNoTenantIdFieldError: ErrorBaseConstructor<void> = null as any;
  public static AuthTokenSubMissingError: ErrorBaseConstructor<void> = null as any;
  public static AuthTokenUserMissingError: ErrorBaseConstructor<{tenantId: number; userId: string}> = null as any;
  public static AuthUserDoesNotHaveRequiredScopesError: ErrorBaseConstructor<void> = null as any;
  public static AuthAzureIdpPayloadVerificationError: ErrorBaseConstructor<void> = null as any;
  public static AuthNotAuthenticatedError: ErrorBaseConstructor<void> = null as any;
  public static AuthNotAuthenticatedWithAzureIdpError: ErrorBaseConstructor<void> = null as any;
  public static AuthTokenNoEmailFieldError: ErrorBaseConstructor<void> = null as any;
}
