import {adeccoLux} from '../data/tenant.data';
import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {CreateJobOrderFormCellType} from './features/CreateJobOrderForm/enum/createJobOrderFormCellType.enum';
import {CreateJobOrderFormCellInputType} from './features/CreateJobOrderForm/enum/createJobOrderFormCellInputType.enum';
import {CreateJobOrderFormCellInputName} from './features/CreateJobOrderForm/enum/createJobOrderFormCellInputName.enum';
import {getDefaultDisableReasonsFeatureConfiguration} from './features/DisableReasons/default';
import {getDefaultLocationFeatureConfiguration} from './features/Locations/default';
import {getDefaultStaffingRequestsFeatureConfiguration} from './features/StaffingRequests/default';
import {getDefaultInvitationFeatureConfiguration} from './features/Invitation/default';
import {getDefaultOrderDetailsTimelineConfiguration} from './features/OrderDetailsTimeline/default';
import {getDefaultOrderDetailsListingStatusesConfiguration} from './features/OrderDetailsListingStatuses/default';
import {getDefaultSupportedFileTypesForUploadFeatureConfiguration} from './features/SupportedFileTypesForUpload/default';
import {getDefaultCandidatesListFeatureConfiguration} from './features/CandidatesList/default';
import {getDefaultJobRoleTemplateFeatureConfiguration} from './features/JobRoleTemplate/default';
import {getDefaultCasesFeatureConfiguration} from './features/Cases/default';
import {getDefaultInvoicesFeatureConfiguration} from './features/Invoices/default';
import {getDefaultMyColleaguesFeatureConfiguration} from './features/MyColleagues/default';
import {getDefaultMyColleaguesFormFeatureConfiguration} from './features/MyColleaguesForm/default';
import {getDefaultMainMenuFeatureConfiguration} from './features/MainMenu/default';
import {getDefaultContractsFeatureConfiguration} from './features/Contracts/default';
import {getDefaultCreateJobOrderFormTemporaryConfiguration} from './features/CreateJobOrderForm/temporary';
import {getDefaultCreateJobOrderTypeConfiguration} from './features/CreateJobOrderType/default';
import {getEmptyOrderDetailsActionsFeatureConfiguration} from './features/OrderDetailsActions/empty';
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
import {jobOrderFormFields} from './features/CreateJobOrderForm/data/fields.data';

const disableReasons: FeatureConfiguration = getDefaultDisableReasonsFeatureConfiguration(adeccoLux.id);
const location: FeatureConfiguration = getDefaultLocationFeatureConfiguration(adeccoLux.id);
const contracts: FeatureConfiguration = getDefaultContractsFeatureConfiguration(adeccoLux.id);
const invoices: FeatureConfiguration = getDefaultInvoicesFeatureConfiguration(adeccoLux.id);
const myColleagues: FeatureConfiguration = getDefaultMyColleaguesFeatureConfiguration(adeccoLux.id);
const myColleaguesForm: FeatureConfiguration = getDefaultMyColleaguesFormFeatureConfiguration(adeccoLux.id);
const staffingRequests: FeatureConfiguration = getDefaultStaffingRequestsFeatureConfiguration(adeccoLux.id);
const invitation: FeatureConfiguration = getDefaultInvitationFeatureConfiguration(adeccoLux.id);
const jobRoleTemplate: FeatureConfiguration = getDefaultJobRoleTemplateFeatureConfiguration(adeccoLux.id);
const mainMenu: FeatureConfiguration = getDefaultMainMenuFeatureConfiguration(adeccoLux.id);
const supportedFileTypesForUpload: FeatureConfiguration = getDefaultSupportedFileTypesForUploadFeatureConfiguration(
  adeccoLux.id,
);
const candidatesList: FeatureConfiguration = getDefaultCandidatesListFeatureConfiguration(adeccoLux.id);
const cases: FeatureConfiguration = getDefaultCasesFeatureConfiguration(adeccoLux.id);
const emptyOrderDetailsActions: FeatureConfiguration = getEmptyOrderDetailsActionsFeatureConfiguration(adeccoLux.id);
const orderDetailsTimeline: FeatureConfiguration = getDefaultOrderDetailsTimelineConfiguration(adeccoLux.id);
const orderDetailsListingStatuses: FeatureConfiguration = getDefaultOrderDetailsListingStatusesConfiguration(
  adeccoLux.id,
);
const localization: FeatureConfiguration = {
  ...getDefaultLocalizationFeatureConfiguration(adeccoLux.id),
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
  },
};
const communications: FeatureConfiguration = {
  ...getDefaultCommunicationsFeatureConfiguration(adeccoLux.id),
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
  ...getDefaultCreateJobOrderTypeConfiguration(adeccoLux.id),
  config: {
    availableTypes: [1],
  },
};
const createJobOrderFormTemporary: FeatureConfiguration = {
  ...getDefaultCreateJobOrderFormTemporaryConfiguration(adeccoLux.id),
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
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.ContractType,
                label: 'contractType',
                placeholder: 'selectContractType',
                validation: {
                  isMandatory: true,
                },
              },
            ],
          },
          {
            cells: [
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
              {
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.Branch,
                label: 'selectBranchLabel',
                placeholder: 'selectBranch',
                dependencyField: 'location',
                dependencyFieldPlaceholder: 'selectBranch',
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
                icon: 'searchIcon',
              },
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
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.Rate,
                label: 'rateTypeLabel',
                placeholder: 'rateTypePlaceholder',
                validation: {
                  isMandatory: true,
                },
              },
              {
                type: CreateJobOrderFormCellType.InputPlusMinus,
                inputName: CreateJobOrderFormCellInputName.Salary,
                label: 'salaryForWorker',
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
            skipWrapping: true,
            cells: [
              {
                // display list of the chosen certifications
                type: CreateJobOrderFormCellType.Certifications,
                inputName: CreateJobOrderFormCellInputName.Certifications,
                skipWrapping: true,
                validation: {
                  isMandatory: false,
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
            styleConfig: 'rowSpace',
            cells: [jobOrderFormFields.attachedFilesField],
          },
          {
            styleConfig: 'rowSpace',
            cells: [
              {
                type: CreateJobOrderFormCellType.InterviewRequired,
                inputName: CreateJobOrderFormCellInputName.InterviewRequired,
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
              },
            ],
          },
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.Shifts,
                label: 'selectShiftType',
                placeholder: 'selectShift',
                validation: {
                  isMandatory: true,
                },
              },
              {
                type: CreateJobOrderFormCellType.DayPicker,
                inputName: CreateJobOrderFormCellInputName.Days,
                initialValue: '0',
                label: 'selectWorkingDays',
                validation: {
                  isMandatory: true,
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
                icon: 'roomIcon',
                iconPosition: 'left',
                label: 'location',
                cardValue: 'location.label',
              },
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'libraryBooksIcon',
                iconPosition: 'left',
                label: 'contractType',
                cardValue: 'contractType.label',
              },
              {
                type: CreateJobOrderFormCellType.InfoCard,
                icon: 'businessIcon',
                iconPosition: 'left',
                label: 'branch',
                cardValue: 'branch.label',
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
                label: 'orderRole',
                cardValue: 'role.label',
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
            rowPadding: CreateJobOrderFormRowPadding.BottomSmall,
            cells: [
              {
                type: CreateJobOrderFormCellType.OrderFileList,
                styleConfig: ['cellTriple', 'cellNoGap', 'cellPL-0'],
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
            styleConfig: 'rowSpace',
            cells: [
              {
                type: CreateJobOrderFormCellType.OrderInterviewRequired,
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
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
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
                label: 'shiftType',
                cardValue: 'shifts.label',
              },
            ],
          },
          {
            rowPadding: CreateJobOrderFormRowPadding.BottomLarge,
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
        ],
      },
    ],
  },
};

/**
 * Feature Configuration for Adecco Luxembourg
 *
 * ID: 110
 * Brand: Adecco
 * Country: Luxembourg
 */
export const featureConfigurationDataTenantAdeccoLux: FeatureConfiguration[] = [
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
  orderDetailsTimeline,
  orderDetailsListingStatuses,
  createJobOrderType,
  jobRoleTemplate,
  mainMenu,
  supportedFileTypesForUpload,
  candidatesList,
  cases,
  emptyOrderDetailsActions,
];
