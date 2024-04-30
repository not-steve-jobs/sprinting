import {ErrorList} from '../../core/error/errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class CaseCommentError extends AppErrorBase {
  public static CaseCommentCreateError: ErrorBaseConstructor<null> = null as any;
  public static CaseCommentFetchError: ErrorBaseConstructor<null> = null as any;
  public static CaseCommentDeleteCommentFileError: ErrorBaseConstructor<null> = null as any;
}
