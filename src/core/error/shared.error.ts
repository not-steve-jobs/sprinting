import {ErrorList} from './errorList.decorator';
import {AppErrorBase} from '../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';
import {PlainObject} from 'src/modules/common/common.dto';

@ErrorList()
export class SharedErrors extends AppErrorBase {
  public static IntentionalError: ErrorBaseConstructor<{a: number; b: string}> = null as any;
  public static InternalError: ErrorBaseConstructor<{message: string}> = null as any;
  public static BadRequestError: ErrorBaseConstructor<void> = null as any;
  public static EntityNotFoundError: ErrorBaseConstructor<{name: string; id: any} | PlainObject> = null;
  public static NoEntityNotFoundError: ErrorBaseConstructor<{name: string}> = null;
  public static DuplicateValueNotAllowed: ErrorBaseConstructor<{name: string; id: any}> = null;
  public static UniqueConstraintError: ErrorBaseConstructor<{
    fieldName: string;
    fieldValue: any;
  }> = null;
  public static DataValidationError: ErrorBaseConstructor<{validationErrors: object}> = null;
  public static EntitySaveError: ErrorBaseConstructor<null> = null;
  public static EntityDeleteError: ErrorBaseConstructor<null> = null;
  public static MissingEnvVariable: ErrorBaseConstructor<{envVariable: string}> = null;
}
