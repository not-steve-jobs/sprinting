import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class JwtHelperErrors extends AppErrorBase {
  public static JwtTokenInvalidAlgorithmError: ErrorBaseConstructor<void> = null;
  public static JwtTokenExpiredError: ErrorBaseConstructor<void> = null;
  public static JwtTokenMalformedError: ErrorBaseConstructor<void> = null;
  public static JwtTokenNotValidError: ErrorBaseConstructor<{reason: string}> = null;
}
