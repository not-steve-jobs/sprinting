import {CandidatesListFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/CandidatesList/interface';
import {CasesFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/Cases/interface';
import {CommunicationsFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/Communications/interface';
import {ContractsFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/Contracts/interface';
import {CreateJobOrderTypeFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/CreateJobOrderType/interface';
import {DisableReasonsFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/DisableReasons/interface';
import {InvitationFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/Invitation/interface';
import {InvoicesFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/Invoices/interface';
import {LocalizationFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/Localization/interface';
import {JobRoleTemplateFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/JobRoleTemplate/interface';
import {LocationFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/Locations/interface';
import {MailProviderFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/MailProvider/interface';
import {MainMenuFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/MainMenu/interface';
import {MyColleaguesFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/MyColleagues/interface';
import {MyColleaguesFormFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/MyColleaguesForm/interface';
import {OrderDetailsActionsFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/OrderDetailsActions/interface';
import {OrderDetailsListingStatusesFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/OrderDetailsListingStatuses/interface';
import {OrderDetailsTimelineFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/OrderDetailsTimeline/interface';
import {StaffingRequestsFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/StaffingRequests/interface';
import {SupportedFileTypesForUploadFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/SupportedFileTypesForUpload/interface';
import {FeatureConfigurationChannel} from './enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from './enum/featureConfigurationFeature.enum';
import {CandidatesListFilterExperienceLevelOption} from 'src/seed/tenantSpecific/featureConfiguration/features/CandidatesList/data/availableFilters/experienceLevelOptions.data';
import {ContractsFilterServiceTypeOption} from 'src/seed/tenantSpecific/featureConfiguration/features/Contracts/data/availableFilters/serviceTypeOptions.data';
import {ContractsFilterDateTypeOption} from 'src/seed/tenantSpecific/featureConfiguration/features/Contracts/data/availableFilters/dateTypeOptions.data';
import {StaffingRequestsFilterDateTypeOption} from 'src/seed/tenantSpecific/featureConfiguration/features/StaffingRequests/data/availableFilters/dateTypeOptions.data';
import {InvoicesFilterOption} from 'src/seed/tenantSpecific/featureConfiguration/features/Invoices/data/availableFilters.data';
import {CreateJobOrderFormFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/CreateJobOrderForm/interface/createJobOrderFormFeatureConfiguration.interface';
import {
  FeatureConfigKeyName,
  FeatureConfigKeyType,
  FeatureConfigUserRole,
} from './enum/featureConfigurationFeatureConfig.enum';

/**
 * Define the FeatureConfiguration options which are currently supported
 *
 * @param {number} tenantId - The Tenant which this configurations is addressed for
 * @param {FeatureConfigurationChannel} channel - // TODO: Find out the purpose of this field and document it
 * @param {FeatureConfigurationFeature} feature - The name of the Feature we're configuring
 * @param {number} roleId - Optionally limit the feature configuration to a specific Role
 * @param {*FeatureConfiguration} config - The real configuration properties used to control the feature
 */
export interface FeatureConfiguration {
  tenantId: number;
  channel: FeatureConfigurationChannel;
  feature: FeatureConfigurationFeature;
  roleId?: number;
  config:
    | DisableReasonsFeatureConfiguration
    | LocalizationFeatureConfiguration
    | LocationFeatureConfiguration
    | ContractsFeatureConfiguration
    | InvoicesFeatureConfiguration
    | MyColleaguesFeatureConfiguration
    | MyColleaguesFormFeatureConfiguration
    | StaffingRequestsFeatureConfiguration
    | InvitationFeatureConfiguration
    | CommunicationsFeatureConfiguration
    | CreateJobOrderFormFeatureConfiguration
    | OrderDetailsTimelineFeatureConfiguration
    | OrderDetailsListingStatusesFeatureConfiguration
    | CreateJobOrderTypeFeatureConfiguration
    | MainMenuFeatureConfiguration
    | SupportedFileTypesForUploadFeatureConfiguration
    | CandidatesListFeatureConfiguration
    | MailProviderFeatureConfiguration
    | CasesFeatureConfiguration
    | OrderDetailsActionsFeatureConfiguration
    | JobRoleTemplateFeatureConfiguration;
}

/**
 * Generic configuration object which provides presentation information used by the webKeys and cardKeys
 *
 * @param {FeatureConfigKeyName} key - Identifies the item and what is used for
 * @param {FeatureConfigKeyType} type - Control the type of the element
 * @param {string} width - Set a fixed with for this element
 * @param {string} format - Control the format of the values in this field (used mainly for date fields)
 * @param {string} className - Control the visual preferences of the element by providing a custom class name
 * @param {FeatureConfigKey[]} fields - A list, containing subitems of the item
 * @param {FeatureConfigUserRole[]} views - Control the visibility of this config according to the role of the users
 * @param {boolean} showWhenAdmin - Show this field only wen the User has admin privileges
 * @param {boolean} showWhenUser - Show this field only to regular Users
 * @param {string} label - Label of the key
 * @param {FeatureConfigKey} subKey - A subitem of the item (often used as a second row with information)
 */
export interface FeatureConfigKey {
  key: FeatureConfigKeyName;
  type: FeatureConfigKeyType;
  width?: string;
  format?: string;
  className?: string;
  fields?: FeatureConfigKey[];
  views?: FeatureConfigUserRole[];
  label?: string;
  showWhenAdmin?: boolean; // TODO: Views is the same, but for webkeys, unify them?
  showWhenUser?: boolean; // TODO: Views is the same, but for webkeys, unify them?
  subKey?: FeatureConfigKey;
}

/**
 * Generic interface used to provide dynamic configurations for the Filters
 *
 * @param {string} type - The type of the field
 * @param {string} filterField - The name of the field in the form
 * @param {string} placeholder - The placeholder which should be used by the field
 * @param {string} label - Tha label which should be used by the field
 * @param {string} fieldToRender - The property name that should be used when rendering the options
 * @param {boolean} multiple - Toggle the option to select multiple options if the type of the field supports such behavior (like select field)
 * @param {FeatureConfigFilterOption[]} options - List with all available options if the type of the field supports such behavior (like select field)
 * @param {boolean} translate - If the filter options should be translated
 * @param {string} entityName - The `entityName` value to which the filter refers
 * @param {boolean} arrowIcon - If the field should use its default icon or an `arrowDownIcon`
 * @param {boolean} onlyForAdmin - Show this field only to Users with admin privileges
 * @param {boolean} showWithoutDateType - If the date field doesn't need of a date type selection as a predecessor action
 */
export interface FeatureConfigFilter {
  type: string;
  filterField: string;
  placeholder?: string;
  label?: string;
  fieldToRender?: string;
  multiple?: boolean;
  translate?: boolean;
  entityName?: string;
  arrowIcon?: boolean;
  onlyForAdmin?: boolean;
  showWithoutDateType?: boolean;
  options?: FeatureConfigFilterOption[];
}

type FeatureConfigFilterOption =
  | CandidatesListFilterExperienceLevelOption
  | ContractsFilterDateTypeOption
  | ContractsFilterServiceTypeOption
  | StaffingRequestsFilterDateTypeOption
  | InvoicesFilterOption;

/**
 * Generic interface which defines the main shared properties used on the Listing Pages
 *
 * @param {FeatureConfigKey[]} webKeys - List with the definitions of the table columns visible on the desktop view
 * @param {FeatureConfigKey[]} cardKeys - List with the definitions of cards visible on the mobile view
 * @param {FeatureConfigFilter} availableFilters - List with the definitions of the Filters and their properties
 */
export interface ListingPageFeatureConfiguration {
  webKeys: FeatureConfigKey[];
  cardKeys: FeatureConfigKey[];
  availableFilters: FeatureConfigFilter[];
}

export interface FeatureConfigurationIdentifier {
  feature: FeatureConfigurationFeature;
  channel: FeatureConfigurationChannel;
}
