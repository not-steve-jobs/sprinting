import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {Permission} from 'src/modules/permission/permission.enum';
import {JobOrderStatus} from 'src/modules/status/status.enum';
import {currencyUSD} from '../../essential/data/currency.data';
import {candidatesListAvailableFilters} from './features/CandidatesList/data/availableFilters/availableFilters.data';
import {experienceLevelOptions} from './features/CandidatesList/data/availableFilters/experienceLevelOptions.data';
import {getDefaultCandidatesListFeatureConfiguration} from './features/CandidatesList/default';
import {getDefaultCasesFeatureConfiguration} from './features/Cases/default';
import {getDefaultContractsFeatureConfiguration} from './features/Contracts/default';
import {CreateJobOrderFormCellInputName} from './features/CreateJobOrderForm/enum/createJobOrderFormCellInputName.enum';
import {CreateJobOrderFormCellInputType} from './features/CreateJobOrderForm/enum/createJobOrderFormCellInputType.enum';
import {CreateJobOrderFormCellType} from './features/CreateJobOrderForm/enum/createJobOrderFormCellType.enum';
import {CreateJobOrderFormRowPadding} from './features/CreateJobOrderForm/enum/createJobOrderFormRowPadding.enum';
import {getDefaultCreateJobOrderFormTemporaryConfiguration} from './features/CreateJobOrderForm/temporary';
import {getDefaultCreateJobOrderTypeConfiguration} from './features/CreateJobOrderType/default';
import {getDefaultDisableReasonsFeatureConfiguration} from './features/DisableReasons/default';
import {getDefaultInvitationFeatureConfiguration} from './features/Invitation/default';
import {getDefaultInvoicesFeatureConfiguration} from './features/Invoices/default';
import {getDefaultJobRoleTemplateFeatureConfiguration} from './features/JobRoleTemplate/default';
import {localizationLanguages} from './features/Localization/data/languages.data';
import {
  defaultLocalizationFeatureConfiguration,
  getDefaultLocalizationFeatureConfiguration,
} from './features/Localization/default';
import {getDefaultLocationFeatureConfiguration} from './features/Locations/default';
import {mainMenuItems} from './features/MainMenu/data/menuItems.data';
import {getDefaultMainMenuFeatureConfiguration} from './features/MainMenu/default';
import {getDefaultMyColleaguesFeatureConfiguration} from './features/MyColleagues/default';
import {getDefaultMyColleaguesFormFeatureConfiguration} from './features/MyColleaguesForm/default';
import {MyColleagueFormFields} from './features/MyColleaguesForm/fields.data';
import {getDefaultOrderDetailsActionsFeatureConfiguration} from './features/OrderDetailsActions/default';
import {getDefaultOrderDetailsListingStatusesConfiguration} from './features/OrderDetailsListingStatuses/default';
import {getDefaultOrderDetailsTimelineConfiguration} from './features/OrderDetailsTimeline/default';
import {getDefaultStaffingRequestsFeatureConfiguration} from './features/StaffingRequests/default';
import {getDefaultSupportedFileTypesForUploadFeatureConfiguration} from './features/SupportedFileTypesForUpload/default';
import {adeccoUsa} from '../data/tenant.data';

const disableReasons: FeatureConfiguration = getDefaultDisableReasonsFeatureConfiguration(adeccoUsa.id);
const location: FeatureConfiguration = getDefaultLocationFeatureConfiguration(adeccoUsa.id);
const contracts: FeatureConfiguration = getDefaultContractsFeatureConfiguration(adeccoUsa.id);
const invoices: FeatureConfiguration = getDefaultInvoicesFeatureConfiguration(adeccoUsa.id);
const myColleagues: FeatureConfiguration = getDefaultMyColleaguesFeatureConfiguration(adeccoUsa.id);
const myColleaguesForm: FeatureConfiguration = {
  ...getDefaultMyColleaguesFormFeatureConfiguration(adeccoUsa.id),
  config: {
    sections: [
      {
        title: 'personalInformation',
        rows: [
          {
            cells: [MyColleagueFormFields.email],
          },
          {
            cells: [MyColleagueFormFields.firstName, MyColleagueFormFields.lastName],
          },
          {
            cells: [MyColleagueFormFields.title, MyColleagueFormFields.department],
          },
          {
            cells: [MyColleagueFormFields.addressLine1, MyColleagueFormFields.addressLine2],
          },
          {
            cells: [MyColleagueFormFields.city, MyColleagueFormFields.state],
          },
          {
            cells: [MyColleagueFormFields.postalCode, MyColleagueFormFields.country],
          },
        ],
      },
      {
        title: 'permissions',
        isHidden: true,
        rows: [
          {
            cells: [
              {
                ...MyColleagueFormFields.permissions,
                validation: undefined,
                values: [
                  {
                    name: Permission.StaffingRequests,
                    isHidden: true,
                    isSelectedByDefault: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'locations',
        rows: [
          {
            cells: [MyColleagueFormFields.locationNote],
          },
          {
            cells: [MyColleagueFormFields.locationCounter],
          },
          {
            cells: [MyColleagueFormFields.locations],
          },
        ],
      },
    ],
  },
};
const staffingRequests: FeatureConfiguration = getDefaultStaffingRequestsFeatureConfiguration(adeccoUsa.id);
const invitation: FeatureConfiguration = getDefaultInvitationFeatureConfiguration(adeccoUsa.id);
const jobRoleTemplate: FeatureConfiguration = getDefaultJobRoleTemplateFeatureConfiguration(adeccoUsa.id);
const mainMenu: FeatureConfiguration = {
  ...getDefaultMainMenuFeatureConfiguration(adeccoUsa.id),
  config: {
    menuItems: [mainMenuItems.dashboard, mainMenuItems.orderManagement],
  },
};
const supportedFileTypesForUpload: FeatureConfiguration = getDefaultSupportedFileTypesForUploadFeatureConfiguration(
  adeccoUsa.id,
);
const candidatesList: FeatureConfiguration = {
  ...getDefaultCandidatesListFeatureConfiguration(adeccoUsa.id),
  config: {
    availableFilters: [
      {
        ...candidatesListAvailableFilters.experienceLevel,
        options: [
          experienceLevelOptions.underOneYear,
          experienceLevelOptions.betweenOneAndTwoYears,
          experienceLevelOptions.betweenTwoAndFiveYears,
          experienceLevelOptions.betweenFiveAndTenYears,
          experienceLevelOptions.betweenTenAndTwentyYears,
          experienceLevelOptions.overTwentyYears,
        ],
      },
      candidatesListAvailableFilters.location,
    ],
  },
};
const cases: FeatureConfiguration = {
  ...getDefaultCasesFeatureConfiguration(adeccoUsa.id),
  config: {
    enableAllCases: false,
    requireFileDownloadConfirmation: [],
  },
};
const orderDetailsTimeline: FeatureConfiguration = getDefaultOrderDetailsTimelineConfiguration(adeccoUsa.id);
const orderDetailsListingStatuses: FeatureConfiguration = getDefaultOrderDetailsListingStatusesConfiguration(
  adeccoUsa.id,
);
const orderDetailsActions: FeatureConfiguration = getDefaultOrderDetailsActionsFeatureConfiguration(adeccoUsa.id);
const localization: FeatureConfiguration = {
  ...getDefaultLocalizationFeatureConfiguration(adeccoUsa.id),
  config: {
    ...defaultLocalizationFeatureConfiguration,
    languages: [
      localizationLanguages.englishUsa,
      localizationLanguages.frenchLuxembourg,
      localizationLanguages.germanLuxembourg,
    ],
    whitelist: [
      localizationLanguages.english.code,
      localizationLanguages.englishUsa.code,
      localizationLanguages.german.code,
      localizationLanguages.germanLuxembourg.code,
      localizationLanguages.french.code,
      localizationLanguages.frenchLuxembourg.code,
    ],
    defaultCurrency: currencyUSD,
  },
};
const createJobOrderType: FeatureConfiguration = {
  ...getDefaultCreateJobOrderTypeConfiguration(adeccoUsa.id),
  config: {
    availableTypes: [1],
    rateType: 50,
  },
};
const createJobOrderFormTemporary: FeatureConfiguration = {
  ...getDefaultCreateJobOrderFormTemporaryConfiguration(adeccoUsa.id),
  config: {
    initialStep: 0, // steps starts from '0'
    formSteps: [
      // step 1
      {
        stepTitle: 'yourOrder',
        rows: [
          {
            cells: [
              {
                // define order name
                type: CreateJobOrderFormCellType.Input,
                inputName: CreateJobOrderFormCellInputName.Name,
                inputType: CreateJobOrderFormCellInputType.Text,
                label: 'orderName',
                placeholder: 'orderNamePlaceholder',
                validation: {
                  isMandatory: true,
                },
              },
              {
                // define order location
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.Location,
                label: 'selectLocationLabel',
                placeholder: 'selectLocation',
                validation: {
                  isMandatory: true,
                },
                disableEditForStatuses: [
                  JobOrderStatus.Submitted,
                  JobOrderStatus.InProgress,
                  JobOrderStatus.CandidatesPreselection,
                  JobOrderStatus.PartiallyCovered,
                  JobOrderStatus.Covered,
                ],
              },
            ],
          },

          {
            cells: [
              {
                type: CreateJobOrderFormCellType.SectionLabel,
                placeholder: 'orderContactsTitle',
              },
            ],
          },
          {
            cells: [
              {
                // define time approver
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.TimeSheetApprover,
                label: 'selectTimeSheetApproverLabel',
                placeholder: 'selectTimeSheetApprover',
                validation: {
                  isMandatory: true,
                },
              },
              {
                // define report to
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.ReportTo,
                label: 'selectReportToLabel',
                placeholder: 'selectReportTo',
                validation: {
                  isMandatory: true,
                },
              },
            ],
          },
          {
            cells: [
              {
                // define bill to
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.BillTo,
                label: 'selectBillToLabel',
                placeholder: 'selectBillTo',
                validation: {
                  isMandatory: true,
                },
              },
            ],
          },
        ],
      },
      // step 2
      {
        stepTitle: 'theRole',
        rows: [
          {
            cells: [
              {
                // select role (driver, waiter, ...)
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.Role,
                label: 'whatRole',
                placeholder: 'selectRole',
                validation: {
                  isMandatory: true,
                },
                icon: 'searchIcon',
                disableEditForStatuses: [
                  JobOrderStatus.Submitted,
                  JobOrderStatus.InProgress,
                  JobOrderStatus.CandidatesPreselection,
                  JobOrderStatus.PartiallyCovered,
                  JobOrderStatus.Covered,
                ],
              },
              {
                type: CreateJobOrderFormCellType.InputPlusMinus,
                inputName: CreateJobOrderFormCellInputName.NumberOfOpenings,
                label: 'howManyWorkers',
                min: 0,
                validation: {
                  isMandatory: true,
                },
                disableEditForStatuses: [JobOrderStatus.Covered],
              },
            ],
          },
          {
            cells: [
              {
                // select work type
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.WorkType,
                label: 'chooseWorkType',
                placeholder: 'selectWorkType',
                validation: {
                  isMandatory: true,
                },
                icon: 'arrowDownIcon',
              },
            ],
          },
          {
            skipWrapping: true,
            cells: [
              {
                // display list of the chosen languages
                type: CreateJobOrderFormCellType.Languages,
                inputName: CreateJobOrderFormCellInputName.Languages,
                skipWrapping: true,
                validation: {
                  isMandatory: false,
                },
                icons: {
                  proficiencyLevelIcon: 'arrowDownIcon',
                },
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.SectionLabel,
                placeholder: 'details',
              },
            ],
          },
          {
            cells: [
              {
                // add job order description
                type: CreateJobOrderFormCellType.TextArea,
                inputName: CreateJobOrderFormCellInputName.JobDescription,
                placeholder: 'jobDescriptionPlaceHolder',
                id: 'jobDescription-create-order-id',
                label: 'jobDescription',
                ariaLabel: 'ariaLabel_jobDescription',
                styleConfig: 'cellDouble',
                maxChars: 3000,
                validation: {
                  isMandatory: true,
                },
              },
            ],
          },
          {
            cells: [
              {
                // add for job order additional information
                type: CreateJobOrderFormCellType.TextArea,
                inputName: CreateJobOrderFormCellInputName.AdditionalInformation,
                placeholder: 'additionalInformationAndEquipmentPlaceholder',
                id: 'additionalInformation-create-order-id',
                label: 'additionalInformation',
                ariaLabel: 'ariaLabel_additionalInformation',
                styleConfig: 'cellDoubleSpace',
                maxChars: 3000,
                validation: {
                  isMandatory: false,
                },
              },
            ],
          },
        ],
      },
      // step 3
      {
        stepTitle: 'workDetails',
        rows: [
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
            cells: [
              {
                type: CreateJobOrderFormCellType.DateRange,
                inputName: CreateJobOrderFormCellInputName.DateRange,
                validation: {
                  isMandatory: true,
                },
                styleConfig: 'cellDouble',
                disableStartDateEditForStatuses: [
                  JobOrderStatus.Submitted,
                  JobOrderStatus.InProgress,
                  JobOrderStatus.CandidatesPreselection,
                  JobOrderStatus.PartiallyCovered,
                  JobOrderStatus.Covered,
                ],
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.DayPicker,
                inputName: CreateJobOrderFormCellInputName.Days,
                initialValue: '0',
                label: 'selectWorkingDays',
                validation: {
                  isMandatory: true,
                },
                styleConfig: 'cellDoubleTablet',
              },
              {
                type: CreateJobOrderFormCellType.TimePicker,
                inputName: CreateJobOrderFormCellInputName.TimePicker,
                timeInterval: 30,
                label: {
                  one: 'startTime',
                  two: 'endTime',
                },
                placeholder: 'selectHour',
                validation: {
                  isMandatory: true,
                },
                styleConfig: 'cellDoubleTablet',
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.TextArea,
                inputName: CreateJobOrderFormCellInputName.DayOneGuidance,
                placeholder: 'dayOneGuidancePlaceHolder',
                id: 'dayOneGuidance-create-order-id',
                label: 'dayOneGuidanceLabel',
                ariaLabel: 'ariaLabel_dayOneGuidance',
                styleConfig: 'cellDoubleSpace',
                maxChars: 500,
                validation: {
                  isMandatory: false,
                },
              },
            ],
          },
        ],
      },
      // step 4
      {
        stepTitle: 'review',
        rows: [
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.CustomLabel,
                placeholder: 'yourOrder',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomSmall,
            cells: [
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'roomIcon',
                iconPosition: 'left',
                label: 'location',
                cardValue: 'location.label',
                styleConfig: 'pb-0',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomLarge,
            cells: [
              {
                type: CreateJobOrderFormCellType.ApproverContact,
              },
              {
                type: CreateJobOrderFormCellType.ReportingToContact,
              },
              {
                type: CreateJobOrderFormCellType.BillToContact,
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.CustomLabel,
                placeholder: 'Position',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomSmall,
            cells: [
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'workIcon',
                iconPosition: 'left',
                label: 'orderTitle',
                cardValue: 'roleAndExperience.label',
              },
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'peopleAltIcon',
                iconPosition: 'left',
                label: 'numberOfWorkers',
                cardValue: 'numberOfOpenings',
              },
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'mapOfferIcon',
                iconPosition: 'left',
                label: 'workType',
                cardValue: 'workType',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
            cells: [],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
            cells: [
              {
                type: CreateJobOrderFormCellType.TextInformation,
                styleConfig: 'cellTriple',
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.CustomLabel,
                placeholder: 'workDetails',
              },
            ],
          },
          {
            rowPadding: `${CreateJobOrderFormRowPadding.BottomSmallMediaLarge} work-details`,
            cells: [
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'insertInvitationIcon',
                iconPosition: 'left',
                label: 'schedule',
                cardValue: 'schedule',
              },
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'insertInvitationIcon', // TODO: Replace with icon based on Figma
                iconPosition: 'left',
                label: 'days',
                cardValue: 'days',
              },
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'queryBuilderIcon',
                iconPosition: 'left',
                label: 'startEndTime',
                cardValue: ['startTime', 'endTime'],
                cellValueType: 'orderDate',
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'lockIcon',
                iconPosition: 'left',
                label: 'scheduledWorkingDays',
                cardValue: 'scheduledWorkingDays',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
            cells: [],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
            cells: [
              {
                type: CreateJobOrderFormCellType.TextGuidanceInformation,
                styleConfig: 'cellTriple',
              },
            ],
          },
        ],
      },
    ],
  },
};

/**
 * Feature Configuration for Adecco USA
 *
 * ID: 101
 * Brand: Adecco
 * Country: USA
 */
export const featureConfigurationDataTenantAdeccoUsa: FeatureConfiguration[] = [
  disableReasons,
  localization,
  location,
  contracts,
  invoices,
  myColleagues,
  myColleaguesForm,
  staffingRequests,
  invitation,
  candidatesList,
  createJobOrderFormTemporary,
  orderDetailsTimeline,
  orderDetailsListingStatuses,
  orderDetailsActions,
  createJobOrderType,
  jobRoleTemplate,
  mainMenu,
  supportedFileTypesForUpload,
  cases,
];
