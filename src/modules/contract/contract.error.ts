import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class ContractError extends AppErrorBase {
  public static ContractsFetchError: ErrorBaseConstructor<null> = null as any;
  //   public static ContracsFetchError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static ContractsExportError: ErrorBaseConstructor<null> = null as any;
}
