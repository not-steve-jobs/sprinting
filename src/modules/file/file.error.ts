import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class FileError extends AppErrorBase {
  public static FileCreateError: ErrorBaseConstructor<null> = null as any;
  public static FileCreateUnsupportedFileTypeError: ErrorBaseConstructor<null> = null as any;
  public static FileCreateMaxSizeExceededError: ErrorBaseConstructor<null> = null as any;
  public static FileCreateMaxNumberOfFilesExceededError: ErrorBaseConstructor<null> = null as any;
  public static FileUpdateExternalIdError: ErrorBaseConstructor<null> = null as any;
  public static FileTenantMissingError: ErrorBaseConstructor<null> = null as any;
  public static FileParentEntityMissingError: ErrorBaseConstructor<null> = null as any;
  public static FileMissingError: ErrorBaseConstructor<null> = null as any;
}
