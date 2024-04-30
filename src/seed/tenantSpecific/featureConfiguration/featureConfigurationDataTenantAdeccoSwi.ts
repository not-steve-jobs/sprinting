import {adeccoSwi} from '../data/tenant.data';
import {currencyCHF} from '../../essential/data/currency.data';
import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {CreateJobOrderFormCellType} from './features/CreateJobOrderForm/enum/createJobOrderFormCellType.enum';
import {CreateJobOrderFormCellInputType} from './features/CreateJobOrderForm/enum/createJobOrderFormCellInputType.enum';
import {CreateJobOrderFormCellInputName} from './features/CreateJobOrderForm/enum/createJobOrderFormCellInputName.enum';
import {getDefaultDisableReasonsFeatureConfiguration} from './features/DisableReasons/default';
import {getDefaultLocationFeatureConfiguration} from './features/Locations/default';
import {getDefaultContractsFeatureConfiguration} from './features/Contracts/default';
import {getDefaultInvoicesFeatureConfiguration} from './features/Invoices/default';
import {getDefaultStaffingRequestsFeatureConfiguration} from './features/StaffingRequests/default';
import {getDefaultInvitationFeatureConfiguration} from './features/Invitation/default';
import {getDefaultOrderDetailsTimelineConfiguration} from './features/OrderDetailsTimeline/default';
import {getDefaultOrderDetailsListingStatusesConfiguration} from './features/OrderDetailsListingStatuses/default';
import {getDefaultSupportedFileTypesForUploadFeatureConfiguration} from './features/SupportedFileTypesForUpload/default';
import {getDefaultCandidatesListFeatureConfiguration} from './features/CandidatesList/default';
import {getDefaultJobRoleTemplateFeatureConfiguration} from './features/JobRoleTemplate/default';
import {getDefaultMailProviderFeatureConfiguration} from './features/MailProvider/default';
import {getDefaultCasesFeatureConfiguration} from './features/Cases/default';
import {getDefaultMyColleaguesFeatureConfiguration} from './features/MyColleagues/default';
import {getDefaultMyColleaguesFormFeatureConfiguration} from './features/MyColleaguesForm/default';
import {getDefaultCreateJobOrderTypeConfiguration} from './features/CreateJobOrderType/default';
import {getDefaultCreateJobOrderFormTemporaryConfiguration} from './features/CreateJobOrderForm/temporary';
import {getEmptyOrderDetailsActionsFeatureConfiguration} from './features/OrderDetailsActions/empty';
import {getDefaultMainMenuFeatureConfiguration} from './features/MainMenu/default';
import {
  getDefaultLocalizationFeatureConfiguration,
  defaultLocalizationFeatureConfiguration,
} from './features/Localization/default';
import {
  getDefaultCommunicationsFeatureConfiguration,
  defaultCommunicationsFeatureConfiguration,
} from './features/Communications/default';
import {communicationsWebKeys} from './features/Communications/data/webKeys.data';
import {CreateJobOrderFormRowPadding} from './features/CreateJobOrderForm/enum/createJobOrderFormRowPadding.enum';
import {localizationLanguages} from './features/Localization/data/languages.data';
import {mainMenuItems} from './features/MainMenu/data/menuItems.data';
import {Permission} from 'src/modules/permission/permission.enum';
import {jobOrderFormFields} from './features/CreateJobOrderForm/data/fields.data';
import {getDefaultCreateJobOrderFormPermanentConfiguration} from './features/CreateJobOrderForm/permanent';
import {MyColleagueFormFields} from './features/MyColleaguesForm/fields.data';
import {CaseCategoryType} from 'src/modules/caseCategory/caseCategory.entity';

const disableReasons: FeatureConfiguration = getDefaultDisableReasonsFeatureConfiguration(adeccoSwi.id);
const myColleagues: FeatureConfiguration = getDefaultMyColleaguesFeatureConfiguration(adeccoSwi.id);
const myColleaguesForm: FeatureConfiguration = {
  ...getDefaultMyColleaguesFormFeatureConfiguration(adeccoSwi.id),
  config: {
    sections: [
      {
        title: 'personalInformation',
        rows: [
          {
            cells: [MyColleagueFormFields.email, MyColleagueFormFields.firstName],
          },
          {
            cells: [MyColleagueFormFields.lastName, MyColleagueFormFields.title],
          },
          {
            cells: [MyColleagueFormFields.department, MyColleagueFormFields.functionField],
          },
          {
            cells: [MyColleagueFormFields.mainLocation],
          },
          {
            cells: [MyColleagueFormFields.changeMainLocation],
          },
        ],
      },
      {
        title: 'permissions',
        rows: [
          {
            cells: [MyColleagueFormFields.permissionNote],
          },
          {
            cells: [
              {
                ...MyColleagueFormFields.permissions,
                values: [
                  {
                    name: Permission.StaffingRequests,
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
const staffingRequests: FeatureConfiguration = getDefaultStaffingRequestsFeatureConfiguration(adeccoSwi.id);
const invitation: FeatureConfiguration = {
  ...getDefaultInvitationFeatureConfiguration(adeccoSwi.id),
  config: {
    daysValid: 14,
  },
};
const orderDetailsTimeline: FeatureConfiguration = getDefaultOrderDetailsTimelineConfiguration(adeccoSwi.id);
const orderDetailsListingStatuses: FeatureConfiguration = getDefaultOrderDetailsListingStatusesConfiguration(
  adeccoSwi.id,
);
const supportedFileTypesForUpload: FeatureConfiguration = getDefaultSupportedFileTypesForUploadFeatureConfiguration(
  adeccoSwi.id,
);
const candidatesList: FeatureConfiguration = getDefaultCandidatesListFeatureConfiguration(adeccoSwi.id);
const defaultCasesFeatureConfiguration: FeatureConfiguration = getDefaultCasesFeatureConfiguration(adeccoSwi.id);
const cases: FeatureConfiguration = {
  ...defaultCasesFeatureConfiguration,
  config: {
    ...defaultCasesFeatureConfiguration.config,
    requireFileDownloadConfirmation: [CaseCategoryType.requestCV],
  },
};
const emptyOrderDetailsActions: FeatureConfiguration = getEmptyOrderDetailsActionsFeatureConfiguration(adeccoSwi.id);
const location: FeatureConfiguration = getDefaultLocationFeatureConfiguration(adeccoSwi.id);
const contracts: FeatureConfiguration = getDefaultContractsFeatureConfiguration(adeccoSwi.id);
const invoices: FeatureConfiguration = getDefaultInvoicesFeatureConfiguration(adeccoSwi.id);
const mailProvider: FeatureConfiguration = getDefaultMailProviderFeatureConfiguration(adeccoSwi.id);
const jobRoleTemplate: FeatureConfiguration = {
  ...getDefaultJobRoleTemplateFeatureConfiguration(adeccoSwi.id),
  config: {
    source: 'api',
    baseUrl: 'https://api-dev.adecco.com/RC/sharedApi',
  },
};
const mainMenu: FeatureConfiguration = {
  ...getDefaultMainMenuFeatureConfiguration(adeccoSwi.id),
  config: {
    menuItems: [
      mainMenuItems.dashboard,
      mainMenuItems.orderManagement,
      mainMenuItems.communication,
      mainMenuItems.reports,
    ],
  },
};
const localization: FeatureConfiguration = {
  ...getDefaultLocalizationFeatureConfiguration(adeccoSwi.id),
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
    defaultCurrency: currencyCHF,
  },
};
const communications: FeatureConfiguration = {
  ...getDefaultCommunicationsFeatureConfiguration(adeccoSwi.id),
  config: {
    ...defaultCommunicationsFeatureConfiguration,
    webKeys: [
      communicationsWebKeys.subject,
      communicationsWebKeys.statusWithSubKey,
      communicationsWebKeys.location,
      communicationsWebKeys.nameAndImageWithSubKey,
    ],
  },
};
const createJobOrderType: FeatureConfiguration = {
  ...getDefaultCreateJobOrderTypeConfiguration(adeccoSwi.id),
  config: {
    availableTypes: [18],
    rateType: 13,
  },
};
const createJobOrderFormTemporary: FeatureConfiguration = {
  ...getDefaultCreateJobOrderFormTemporaryConfiguration(adeccoSwi.id),
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
              },
              {
                // select experience
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.Experience,
                label: 'selectExperienceLabel',
                placeholder: 'selectExperience',
                sortOptions: false,
                validation: {
                  isMandatory: true,
                },
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.InputPlusMinus,
                inputName: CreateJobOrderFormCellInputName.NumberOfOpenings,
                label: 'howManyWorkers',
                min: 0,
                validation: {
                  isMandatory: true,
                },
              },
              {
                type: CreateJobOrderFormCellType.InputPlusMinus,
                inputName: CreateJobOrderFormCellInputName.Salary,
                label: 'salaryForWorker',
                currencySuffix: '/h',
                validation: {
                  isMandatory: true,
                },
                dependencyFields: ['role', 'experience'],
                showInputDescription: true,
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
                  isMandatory: true,
                  validateList: {
                    errorPropName: 'language',
                  },
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
                placeholder: 'additionalInformationPlaceholder',
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
          {
            cells: [jobOrderFormFields.attachedFilesField],
          },
        ],
      },
      // step 3
      {
        stepTitle: 'workDetails',
        rows: [
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.DateRange,
                inputName: CreateJobOrderFormCellInputName.DateRange,
                validation: {
                  isMandatory: true,
                },
                styleConfig: 'cellDouble',
              },
            ],
          },
          {
            cells: [jobOrderFormFields.pesRegistrationMessage],
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
            rowPadding: CreateJobOrderFormRowPadding.BottomLarge,
            cells: [
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'accountBalanceWalletIcon',
                iconPosition: 'left',
                label: 'estimatedSalary',
                cardValue: 'estimatedSalary',
              },
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'roomIcon',
                iconPosition: 'left',
                label: 'location',
                cardValue: 'location.label',
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.CustomLabel,
                placeholder: 'theRole',
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
                label: 'orderRoleAndExperience',
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
                icon: 'languageIcon',
                iconPosition: 'left',
                label: 'languageRequired',
                cardValue: 'value.name',
                listOfData: 'languages',
                styleConfig: 'pb-25',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
            cells: [],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomSmall,
            cells: [
              {
                type: CreateJobOrderFormCellType.TextInformation,
                styleConfig: 'cellTriple',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomLarge,
            cells: [
              {
                type: CreateJobOrderFormCellType.OrderFileList,
                styleConfig: ['cellTriple', 'cellNoGap', 'cellPL-0'],
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
                icon: 'jobTitleAddIcon',
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
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
            cells: [],
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
            cells: [
              {
                type: CreateJobOrderFormCellType.TextGuidanceInformation,
                styleConfig: 'cellTriple',
              },
            ],
          },
          {
            cells: [jobOrderFormFields.pesRegistrationMessage],
          },
        ],
      },
    ],
  },
};

// eslint-disable-next-line
const createJobOrderFormPermanent: FeatureConfiguration = {
  ...getDefaultCreateJobOrderFormPermanentConfiguration(adeccoSwi.id),
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
                placeholder: 'enterRole',
                validation: {
                  isMandatory: true,
                },
              },
              {
                // select experience
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.Experience,
                label: 'selectExperienceYearsLabel',
                placeholder: 'selectExperience',
                validation: {
                  isMandatory: true,
                },
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.InputPlusMinus,
                inputName: CreateJobOrderFormCellInputName.NumberOfOpenings,
                label: 'howManyWorkers',
                min: 0,
                validation: {
                  isMandatory: true,
                },
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.InputPlusMinus,
                inputName: CreateJobOrderFormCellInputName.Salary,
                label: 'salaryLow',
                min: 0,
                validation: {
                  isMandatory: true,
                },
              },
              {
                type: CreateJobOrderFormCellType.InputPlusMinus,
                inputName: CreateJobOrderFormCellInputName.SalaryHigh,
                label: 'salaryHigh',
                min: 0,
                validation: {
                  isMandatory: true,
                },
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
                placeholder: 'enterLanguage',
                skipWrapping: true,
                validation: {
                  isMandatory: true,
                  validateList: {
                    errorPropName: 'language',
                  },
                },
                icons: {
                  languageIcon: 'arrowDownIcon',
                  proficiencyLevelIcon: 'arrowDownIcon',
                },
              },
            ],
          },
          {
            skipWrapping: true,
            cells: [
              {
                // display list of the chosen certifications
                type: CreateJobOrderFormCellType.Certifications,
                inputName: CreateJobOrderFormCellInputName.Certifications,
                skipWrapping: true,
                placeholder: 'enterCertificate',
                validation: {
                  validateList: {
                    errorPropName: 'certification',
                    type: CreateJobOrderFormCellType.Date,
                  },
                },
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
                  isMandatory: false,
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
                placeholder: 'additionalInformationPlaceholder',
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
          {
            cells: [
              {
                // show button to upload more files
                type: CreateJobOrderFormCellType.UploadFiles,
                inputName: CreateJobOrderFormCellInputName.AttachedFiles,
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
            cells: [jobOrderFormFields.dateStartField],
          },
          {
            cells: [jobOrderFormFields.pesRegistrationMessage],
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
            rowPadding: CreateJobOrderFormRowPadding.BottomLarge,
            cells: [
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'roomIcon',
                iconPosition: 'left',
                label: 'location',
                cardValue: 'location.label',
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.CustomLabel,
                placeholder: 'theRole',
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
                label: 'orderRoleAndExperience',
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
                icon: 'accountBalanceWalletIcon',
                iconPosition: 'left',
                label: 'preferredSalary',
                cardValue: 'salary',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
            cells: [
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'languageIcon',
                iconPosition: 'left',
                label: 'languageRequired',
                cardValue: 'value.name',
                listOfData: 'languages',
                styleConfig: 'pb-25',
              },
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'assistantIcon',
                iconPosition: 'left',
                label: 'certificateRequired',
                cardValue: 'value.name',
                listOfData: 'certifications',
                styleConfig: 'pb-25',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomSmall,
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
                type: CreateJobOrderFormCellType.OrderFileList,
                styleConfig: ['cellTriple', 'cellNoGap', 'cellPL-0'],
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
            rowPadding: CreateJobOrderFormRowPadding.BottomLarge,
            cells: [
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'insertInvitationIcon',
                iconPosition: 'left',
                label: 'scheduledStart',
                cardValue: 'scheduledStart',
              },
            ],
          },
          {
            cells: [jobOrderFormFields.pesRegistrationMessage],
          },
        ],
      },
    ],
  },
};

/**
 * Feature Configuration for Adecco Switzerland
 *
 * ID: 137
 * Brand: Adecco
 * Country: CH
 */
export const featureConfigurationDataTenantAdeccoSwi: FeatureConfiguration[] = [
  disableReasons,
  localization,
  location,
  contracts,
  invoices,
  myColleagues,
  myColleaguesForm,
  staffingRequests,
  invitation,
  communications,
  createJobOrderFormTemporary,
  // createJobOrderFormPermanent,
  orderDetailsTimeline,
  orderDetailsListingStatuses,
  createJobOrderType,
  mainMenu,
  jobRoleTemplate,
  supportedFileTypesForUpload,
  candidatesList,
  mailProvider,
  cases,
  emptyOrderDetailsActions,
];
