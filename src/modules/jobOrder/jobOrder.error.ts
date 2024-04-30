import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class JobOrderError extends AppErrorBase {
  public static JobOrderCreateError: ErrorBaseConstructor<null> = null as any;
  public static JobOrderUpdateError: ErrorBaseConstructor<null> = null as any;
  public static JobOrderDoesNotExist: ErrorBaseConstructor<{id?: string} | null> = null as any;
  public static JobOrderFileUploadError: ErrorBaseConstructor<null> = null as any;
  public static StuffingRequestAggregateError: ErrorBaseConstructor<null> = null as any;
  public static JobOrderExportError: ErrorBaseConstructor<null> = null as any;
  public static JobOrderFetchError: ErrorBaseConstructor<null> = null as any;
}
