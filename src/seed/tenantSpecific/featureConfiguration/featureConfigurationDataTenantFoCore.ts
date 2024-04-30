import {focore} from '../data/tenant.data';
import {DisableReasonEnum} from '../../../modules/disableReason/disableReason.enum';
import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {CreateJobOrderFormCellType} from './features/CreateJobOrderForm/enum/createJobOrderFormCellType.enum';
import {CreateJobOrderFormCellInputType} from './features/CreateJobOrderForm/enum/createJobOrderFormCellInputType.enum';
import {CreateJobOrderFormCellInputName} from './features/CreateJobOrderForm/enum/createJobOrderFormCellInputName.enum';
import {getDefaultCandidatesListFeatureConfiguration} from './features/CandidatesList/default';
import {getDefaultCommunicationsFeatureConfiguration} from './features/Communications/default';
import {getDefaultContractsFeatureConfiguration} from './features/Contracts/default';
import {getDefaultCreateJobOrderFormPermanentConfiguration} from './features/CreateJobOrderForm/permanent';
import {getDefaultCreateJobOrderFormTemporaryConfiguration} from './features/CreateJobOrderForm/temporary';
import {getDefaultCreateJobOrderTypeConfiguration} from './features/CreateJobOrderType/default';
import {getDefaultInvoicesFeatureConfiguration} from './features/Invoices/default';
import {getDefaultLocalizationFeatureConfiguration} from './features/Localization/default';
import {getDefaultJobRoleTemplateFeatureConfiguration} from './features/JobRoleTemplate/default';
import {getDefaultLocationFeatureConfiguration} from './features/Locations/default';
import {getDefaultMailProviderFeatureConfiguration} from './features/MailProvider/default';
import {getDefaultMainMenuFeatureConfiguration} from './features/MainMenu/default';
import {getDefaultMyColleaguesFeatureConfiguration} from './features/MyColleagues/default';
import {getDefaultMyColleaguesFormFeatureConfiguration} from './features/MyColleaguesForm/default';
import {getDefaultOrderDetailsListingStatusesConfiguration} from './features/OrderDetailsListingStatuses/default';
import {getDefaultOrderDetailsTimelineConfiguration} from './features/OrderDetailsTimeline/default';
import {getDefaultStaffingRequestsFeatureConfiguration} from './features/StaffingRequests/default';
import {getDefaultSupportedFileTypesForUploadFeatureConfiguration} from './features/SupportedFileTypesForUpload/default';
import {getEmptyOrderDetailsActionsFeatureConfiguration} from './features/OrderDetailsActions/empty';
import {getDefaultDisableReasonsFeatureConfiguration} from './features/DisableReasons/default';
import {contractsWebKeys} from './features/Contracts/data/webKeys.data';
import {contractsCardKeys} from './features/Contracts/data/cardKeys.data';
import {contractsAvailableFilters} from './features/Contracts/data/availableFilters/availableFilters.data';
import {contractsFilterDateTypeOptions} from './features/Contracts/data/availableFilters/dateTypeOptions.data';
import {serviceTypeOptions} from './features/Contracts/data/availableFilters/serviceTypeOptions.data';
import {CreateJobOrderFormRowPadding} from './features/CreateJobOrderForm/enum/createJobOrderFormRowPadding.enum';
import {invoicesWebKeys} from './features/Invoices/data/webKeys.data';
import {invoicesCardKeys} from './features/Invoices/data/cardKeys.data';
import {invoicesAvailableFilters} from './features/Invoices/data/availableFilters.data';
import {getDefaultCasesFeatureConfiguration} from './features/Cases/default';
import {jobOrderFormFields} from './features/CreateJobOrderForm/data/fields.data';

const localization: FeatureConfiguration = getDefaultLocalizationFeatureConfiguration(focore.id);
const location: FeatureConfiguration = getDefaultLocationFeatureConfiguration(focore.id);
const myColleagues: FeatureConfiguration = getDefaultMyColleaguesFeatureConfiguration(focore.id);
const myColleaguesForm: FeatureConfiguration = getDefaultMyColleaguesFormFeatureConfiguration(focore.id);
const staffingRequests: FeatureConfiguration = getDefaultStaffingRequestsFeatureConfiguration(focore.id);
const communications: FeatureConfiguration = getDefaultCommunicationsFeatureConfiguration(focore.id);
const mainMenu: FeatureConfiguration = getDefaultMainMenuFeatureConfiguration(focore.id);
const supportedFileTypesForUpload: FeatureConfiguration = getDefaultSupportedFileTypesForUploadFeatureConfiguration(
  focore.id,
);
const candidatesList: FeatureConfiguration = getDefaultCandidatesListFeatureConfiguration(focore.id);
const emptyOrderDetailsActions: FeatureConfiguration = getEmptyOrderDetailsActionsFeatureConfiguration(focore.id);
const orderDetailsTimeline: FeatureConfiguration = getDefaultOrderDetailsTimelineConfiguration(focore.id);
const orderDetailsListingStatuses: FeatureConfiguration = getDefaultOrderDetailsListingStatusesConfiguration(focore.id);
const createJobOrderType: FeatureConfiguration = getDefaultCreateJobOrderTypeConfiguration(focore.id);
const mailProvider: FeatureConfiguration = getDefaultMailProviderFeatureConfiguration(focore.id);
const cases: FeatureConfiguration = getDefaultCasesFeatureConfiguration(focore.id);
const disableReasons: FeatureConfiguration = {
  ...getDefaultDisableReasonsFeatureConfiguration(focore.id),
  config: {
    reasons: [
      DisableReasonEnum.NoLongerWorkInACompany,
      DisableReasonEnum.NewPosition,
      DisableReasonEnum.LongBreak,
      DisableReasonEnum.Other,
    ],
  },
};
const contracts: FeatureConfiguration = {
  ...getDefaultContractsFeatureConfiguration(focore.id),
  config: {
    webKeys: [
      contractsWebKeys.number,
      contractsWebKeys.location,
      contractsWebKeys.legalEntity,
      contractsWebKeys.dateStart,
      contractsWebKeys.dateEnd,
      contractsWebKeys.status,
      contractsWebKeys.signatureDate,
      contractsWebKeys.signedBy,
      contractsWebKeys.serviceType,
    ],
    cardKeys: [
      contractsCardKeys.legalEntity,
      contractsCardKeys.dateStart,
      contractsCardKeys.dateEnd,
      contractsCardKeys.status,
      contractsCardKeys.serviceType,
    ],
    availableFilters: [
      contractsAvailableFilters.location,
      {
        ...contractsAvailableFilters.dateType,
        options: [
          contractsFilterDateTypeOptions.dateStart,
          contractsFilterDateTypeOptions.dateEnd,
          contractsFilterDateTypeOptions.signatureDate,
        ],
      },
      contractsAvailableFilters.periodFrom,
      contractsAvailableFilters.periodTo,
      contractsAvailableFilters.status,
      contractsAvailableFilters.signedBy,
      {
        ...contractsAvailableFilters.serviceType,
        options: [
          serviceTypeOptions.tem,
          serviceTypeOptions.civilContracts,
          serviceTypeOptions.perm,
          serviceTypeOptions.hrCounsulting,
        ],
      },
    ],
  },
};
const invoices: FeatureConfiguration = {
  ...getDefaultInvoicesFeatureConfiguration(focore.id),
  config: {
    webKeys: [
      invoicesWebKeys.number,
      invoicesWebKeys.location,
      invoicesWebKeys.issueDate,
      invoicesWebKeys.duePaymentDate,
      invoicesWebKeys.status,
      invoicesWebKeys.amountBeforeTax,
      invoicesWebKeys.currency,
      invoicesWebKeys.totalAmount,
      invoicesWebKeys.attachments,
    ],
    cardKeys: [
      invoicesCardKeys.number,
      invoicesCardKeys.status,
      invoicesCardKeys.issueDate,
      invoicesCardKeys.duePaymentDate,
      invoicesCardKeys.location,
      invoicesCardKeys.totalAmount,
    ],
    availableFilters: [
      invoicesAvailableFilters.location,
      invoicesAvailableFilters.status,
      {
        ...invoicesAvailableFilters.dateType,
        options: [
          {id: '1', label: 'issueDate', name: 'issueDate'},
          {id: '2', label: 'duePaymentDate', name: 'duePaymentDate'},
        ],
      },
      invoicesAvailableFilters.periodFrom,
      invoicesAvailableFilters.periodTo,
      {
        ...invoicesAvailableFilters.attachments,
        options: [{label: 'attachments', value: 'attachments'}],
      },
      {
        ...invoicesAvailableFilters.currency,
        options: [
          {id: '1', label: 'EUR', name: 'EUR'},
          {id: '2', label: 'PLN', name: 'PLN'},
        ],
      },
    ],
  },
};
const jobRoleTemplate: FeatureConfiguration = {
  ...getDefaultJobRoleTemplateFeatureConfiguration(focore.id),
  config: {
    source: 'api',
    baseUrl: 'https://api-dev.adecco.com/RC/sharedApi',
  },
};
const createJobOrderFormTemporary: FeatureConfiguration = {
  ...getDefaultCreateJobOrderFormTemporaryConfiguration(focore.id),
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
            rowPadding: CreateJobOrderFormRowPadding.BottomMedium,
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
const createJobOrderFormPermanent: FeatureConfiguration = {
  ...getDefaultCreateJobOrderFormPermanentConfiguration(focore.id),
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
          {
            cells: [
              {
                type: CreateJobOrderFormCellType.Select,
                inputName: CreateJobOrderFormCellInputName.Branch,
                label: 'selectBranchLabel',
                placeholder: 'selectBranch',
                dependencyField: 'location',
                dependencyFieldPlaceholder: 'selectLocationFirst',
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
          {
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
            cells: [jobOrderFormFields.dateStartField],
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
            rowPadding: CreateJobOrderFormRowPadding.BottomLarge,
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
        ],
      },
    ],
  },
};

/**
 * Feature Configuration for InFo Core
 * Note: This tenant is used only for demo purposes
 *
 * ID: 88
 * Brand: FOCORE
 * Country: FC
 */
export const featureConfigurationDataTenantAdeccoFoCore: FeatureConfiguration[] = [
  disableReasons,
  localization,
  location,
  contracts,
  invoices,
  myColleagues,
  myColleaguesForm,
  staffingRequests,
  communications,
  createJobOrderFormTemporary,
  createJobOrderFormPermanent,
  orderDetailsTimeline,
  orderDetailsListingStatuses,
  createJobOrderType,
  mainMenu,
  jobRoleTemplate,
  supportedFileTypesForUpload,
  candidatesList,
  mailProvider,
  emptyOrderDetailsActions,
  cases,
];
