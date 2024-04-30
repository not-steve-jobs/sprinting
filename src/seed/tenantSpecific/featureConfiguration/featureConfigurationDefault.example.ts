import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {getDefaultDisableReasonsFeatureConfiguration} from './features/DisableReasons/default';
import {getDefaultLocalizationFeatureConfiguration} from './features/Localization/default';
import {getDefaultLocationFeatureConfiguration} from './features/Locations/default';
import {getDefaultContractsFeatureConfiguration} from './features/Contracts/default';
import {getDefaultInvoicesFeatureConfiguration} from './features/Invoices/default';
import {getDefaultMyColleaguesFeatureConfiguration} from './features/MyColleagues/default';
import {getDefaultStaffingRequestsFeatureConfiguration} from './features/StaffingRequests/default';
import {getDefaultInvitationFeatureConfiguration} from './features/Invitation/default';
import {getDefaultCommunicationsFeatureConfiguration} from './features/Communications/default';
import {getDefaultCreateJobOrderFormTemporaryConfiguration} from './features/CreateJobOrderForm/temporary';
import {getDefaultOrderDetailsTimelineConfiguration} from './features/OrderDetailsTimeline/default';
import {getDefaultOrderDetailsListingStatusesConfiguration} from './features/OrderDetailsListingStatuses/default';
import {getDefaultCreateJobOrderFormPermanentConfiguration} from './features/CreateJobOrderForm/permanent';
import {getDefaultCreateJobOrderTypeConfiguration} from './features/CreateJobOrderType/default';
import {getDefaultMainMenuFeatureConfiguration} from './features/MainMenu/default';
import {getDefaultSupportedFileTypesForUploadFeatureConfiguration} from './features/SupportedFileTypesForUpload/default';
import {getDefaultCandidatesListFeatureConfiguration} from './features/CandidatesList/default';
import {getDefaultCasesFeatureConfiguration} from './features/Cases/default';
import {getDefaultMyColleaguesFormFeatureConfiguration} from './features/MyColleaguesForm/default';

/**
 * Default feature configuration used to showcase the structure and to provide the basic set of features
 * This config can be used as a default base for the different tenants
 *
 * @param {number} tenantId - The ID of the Tenant which should be used in the feature configurations
 * @returns {FeatureConfiguration[]} - The default feature configuration set of rules
 */
export const generateDefaultFeatureConfiguration = (tenantId: number): FeatureConfiguration[] => [
  getDefaultDisableReasonsFeatureConfiguration(tenantId),
  getDefaultLocalizationFeatureConfiguration(tenantId),
  getDefaultLocationFeatureConfiguration(tenantId),
  getDefaultContractsFeatureConfiguration(tenantId),
  getDefaultInvoicesFeatureConfiguration(tenantId),
  getDefaultMyColleaguesFeatureConfiguration(tenantId),
  getDefaultStaffingRequestsFeatureConfiguration(tenantId),
  getDefaultInvitationFeatureConfiguration(tenantId),
  getDefaultCommunicationsFeatureConfiguration(tenantId),
  getDefaultCreateJobOrderFormTemporaryConfiguration(tenantId),
  getDefaultOrderDetailsTimelineConfiguration(tenantId),
  getDefaultOrderDetailsListingStatusesConfiguration(tenantId),
  getDefaultCreateJobOrderFormPermanentConfiguration(tenantId),
  getDefaultCreateJobOrderTypeConfiguration(tenantId),
  getDefaultMainMenuFeatureConfiguration(tenantId),
  getDefaultSupportedFileTypesForUploadFeatureConfiguration(tenantId),
  getDefaultCandidatesListFeatureConfiguration(tenantId),
  // getDefaultMailProviderFeatureConfiguration(tenantId), // Note: Not yet default fot all tenants
  getDefaultCasesFeatureConfiguration(tenantId),
  getDefaultMyColleaguesFormFeatureConfiguration(tenantId),
];
