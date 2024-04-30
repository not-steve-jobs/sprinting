import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class FileSystemError extends AppErrorBase {
  public static FileReadError: ErrorBaseConstructor<null> = null as any;
  public static FileSaveError: ErrorBaseConstructor<null> = null as any;
  public static DeleteFileAndFolderError: ErrorBaseConstructor<null> = null as any;
}
