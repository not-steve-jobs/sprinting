import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {CreateJobOrderFormCellInputName} from 'src/seed/tenantSpecific/featureConfiguration/features/CreateJobOrderForm/enum/createJobOrderFormCellInputName.enum';
import {CreateJobOrderFormRowPadding} from './enum/createJobOrderFormRowPadding.enum';
import {CreateJobOrderFormCellType} from './enum/createJobOrderFormCellType.enum';
import {CreateJobOrderFormCellInputType} from './enum/createJobOrderFormCellInputType.enum';
import {CreateJobOrderFormFeatureConfiguration} from './interface/createJobOrderFormFeatureConfiguration.interface';
import {jobOrderFormFields} from './data/fields.data';

export const defaultCreateJobOrderFormPermanentConfiguration: CreateJobOrderFormFeatureConfiguration = {
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
                  type: 'date',
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
          cells: [jobOrderFormFields.attachedFilesField],
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
          cells: [
            {
              type: CreateJobOrderFormCellType.DateRange,
              inputName: CreateJobOrderFormCellInputName.DateRange,
              label: 'dateRangeLabelShort',
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
              styleConfig: 'cellTriple',
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
};

/**
 * Get the default feature configuration for the Create Job Order Form feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Create Job Order Form feature
 */
export const getDefaultCreateJobOrderFormPermanentConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.CreateJobOrderFormPermanent,
  config: defaultCreateJobOrderFormPermanentConfiguration,
});
