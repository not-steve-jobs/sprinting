import {CommonIntegrationErrors} from './../commonIntegrationErrors.enum';
import {ErrorList} from '../../../core/error/errorList.decorator';
import {AppErrorBase} from '../../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class SalesForceError extends AppErrorBase {
  public static CountryNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.COUNTRY_NOT_FOUND;
  }> = null as any;

  public static ClientNotFound: ErrorBaseConstructor<{message: CommonIntegrationErrors.CLIENT_NOT_FOUND}> = null as any;

  public static SalesForceInvalidDataError: ErrorBaseConstructor<{message?: string} | null> = null as any;

  public static CustomerNotSpecified: ErrorBaseConstructor<{
    message: SaleForceErrors.CUSTOMER_NOT_SPECIFIED;
  }> = null as any;

  public static ContactNotSpecified: ErrorBaseConstructor<{
    message: SaleForceErrors.CONTACT_NOT_SPECIFIED;
  }> = null as any;

  public static CustomerNotFound: ErrorBaseConstructor<{
    message: SaleForceErrors.CUSTOMER_NOT_FOUND;
  }> = null as any;

  public static MainLocationNotFound: ErrorBaseConstructor<{
    message: SaleForceErrors.MAIN_LOCATION_NOT_FOUND;
  }> = null as any;

  public static PermissionNotFound: ErrorBaseConstructor<{
    message?: SaleForceErrors.PERMISSION_NOT_FOUND;
    permissionName: string;
  }> = null as any;

  public static UpdateExternalContactId: ErrorBaseConstructor<{
    message?: SaleForceErrors.UPDATED_EXTERNAL_CONTACT_ID;
  }> = null as any;
}

enum SaleForceErrors {
  EXTERNAL_CUSTOMER_ID_NOT_PROVIDED = 'Event id not provided',
  CUSTOMER_NOT_SPECIFIED = 'Customer id not specified',
  CONTACT_NOT_SPECIFIED = 'Contact id not specified',
  CUSTOMER_NOT_FOUND = 'Customer not found',
  MAIN_LOCATION_NOT_FOUND = 'Main location not found',
  PERMISSION_NOT_FOUND = 'Permission not found',
  UPDATED_EXTERNAL_CONTACT_ID = 'Update external contact id',
}
