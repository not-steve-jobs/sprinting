import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class FeatureConfigurationErrors extends AppErrorBase {
  public static FeatureConfigurationNotExistsError: ErrorBaseConstructor<{
    feature: string;
  }> = null;
}
