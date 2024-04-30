import {CommonIntegrationErrors} from './../commonIntegrationErrors.enum';
import {ErrorList} from '../../../core/error/errorList.decorator';
import {AppErrorBase} from '../../../lib/appErrorBase/appErrorBase';
import {ErrorBaseConstructor} from '../../../lib/appErrorBase/errorBaseConstructor.interface';

@ErrorList()
export class InfoSystemError extends AppErrorBase {
  public static InfoSystemInvalidDataError: ErrorBaseConstructor<{message?: string} | null> = null as any;
  public static LocationAlreadyExists: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.LOCATION_ALREADY_EXISTS;
  }> = null as any;
  public static BranchNotFound: ErrorBaseConstructor<{message: CommonIntegrationErrors.BRANCH_NOT_FOUND}> = null as any;
  public static LocationIdMissing: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.LOCATION_ID_MISSING;
  }> = null as any;
  public static LocationNotHQOrSite: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.LOCATION_NOT_HQ_OR_SITE;
  }> = null as any;
  public static CountryNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.COUNTRY_NOT_FOUND;
  }> = null as any;
  public static CloseReasonNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.CLOSE_REASON_NOT_FOUND;
  }> = null as any;
  public static CloseReasonArgumentCreate: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.CAN_NOT_CREATE_CLOSE_REASON;
  }> = null as any;
  public static CloseReasonArgumentDelete: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.CAN_NOT_DELETE_CLOSE_REASON;
  }> = null as any;
  public static LanguageNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.LANGUAGE_NOT_FOUND;
  }> = null as any;
  public static LanguageAddedToOrder: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.LANGUAGE_ADDED_TO_ORDER;
  }> = null as any;
  public static CertificationNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.CERTIFICATION_NOT_FOUND;
  }> = null as any;
  public static CertificationAddedToOrder: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.CERTIFICATION_ADDED_TO_ORDER;
  }> = null as any;
  public static JobRoleNotFound: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.JOB_ROLE_NOT_FOUND;
  }> = null as any;
  public static JobRoleAddedToOrder: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.JOB_ROLE_ADDED_TO_ORDER;
  }> = null as any;
  public static LanguageNotExistsForOrder: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.LANGUAGE_NOT_EXISTS_FOR_ORDER;
  }> = null as any;
  public static CertificationNotExistsForOrder: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.CERTIFICATION_NOT_EXISTS_FOR_ORDER;
  }> = null as any;
  public static FileNotExists: ErrorBaseConstructor<{
    message: CommonIntegrationErrors.FILE_NOT_FOUND;
  }> = null as any;
  public static WorksiteParentNotSpecified: ErrorBaseConstructor<{
    message?: CommonIntegrationErrors.WORKPLACE_PARENT_NOT_PROVIDED;
    workPlaceId: string;
    parentLocationId: string;
  }> = null as any;
  public static WorksiteParentNotExist: ErrorBaseConstructor<{
    message?: CommonIntegrationErrors.WORKPLACE_PARENT_NOT_EXIST;
    workPlaceId: string;
    parentLocationId: string;
  }> = null as any;
  public static WorksiteStatusNotExists: ErrorBaseConstructor<{
    message?: CommonIntegrationErrors.WORKPLACE_STATUS_NOT_EXISTS;
    workPlaceId: string;
    parentLocationId: string;
  }> = null as any;
}
