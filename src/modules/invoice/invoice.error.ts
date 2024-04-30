import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class InvoiceError extends AppErrorBase {
  public static InvoicesFetchError: ErrorBaseConstructor<null> = null as any;
  //   public static InvoicesFetchError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static InvoicesExportError: ErrorBaseConstructor<null> = null as any;
  public static InvoicesFetchChartDataError: ErrorBaseConstructor<null> = null as any;
}
