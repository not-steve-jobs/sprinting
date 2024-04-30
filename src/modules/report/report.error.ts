import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class ReportServiceErrors extends AppErrorBase {
  public static ReportTokenGenerateError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static GetReportInGroupError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static EmbedTokenRequestError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static AcquireAuthTokenError: ErrorBaseConstructor<{message?: string} | null> = null as any;
}
