import {ErrorList} from 'src/core/error/errorList.decorator';
import {AppErrorBase} from 'src/lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from 'src/lib/appErrorBase/errorBaseConstructor.interface';
import {CommonIntegrationErrors} from './commonIntegrationErrors.enum';

@ErrorList()
export class CommonIntegrationError extends AppErrorBase {
  public static CountryNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.COUNTRY_NOT_FOUND;
  }> = null as any;

  public static EventIdNotProvided: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.EVENT_ID_NOT_PROVIDED;
  }> = null as any;

  public static CountryBrandNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.COUNTRY_BRAND_NOT_FOUND;
  }> = null as any;

  public static CountryNotMatchingLocationCountry: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.COUNTRY_NOT_MATCHING_LOCATION_COUNTRY;
  }> = null as any;

  public static LocationNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.LOCATION_NOT_FOUND;
  }> = null as any;

  public static UserNotFound: ErrorBaseConstructor<{message: CommonIntegrationErrors.USER_NOT_FOUND}> = null as any;

  public static UserCountryBrandNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.USER_COUNTRY_BRAND_NOT_FOUND;
  }> = null as any;

  public static JobOrderNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.JOB_ORDER_NOT_FOUND;
  }> = null as any;
}
