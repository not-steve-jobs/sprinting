import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class AzureStorageHelperErrors extends AppErrorBase {
  public static BlobStorageError: ErrorBaseConstructor<null> = null as any;
  public static ImageUploadError: ErrorBaseConstructor<null> = null as any;
  public static ImageDeleteError: ErrorBaseConstructor<null> = null as any;
  public static FileUploadError: ErrorBaseConstructor<{
    tenantId: number;
    entityId?: string;
    jobOrderId?: string;
    filename?: string;
  } | null> = null as any;
  public static FileDeleteError: ErrorBaseConstructor<null> = null as any;
}
