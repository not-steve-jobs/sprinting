import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {CreateJobOrderFormCellType} from 'src/seed/tenantSpecific/featureConfiguration/features/CreateJobOrderForm/enum/createJobOrderFormCellType.enum';
import {CreateJobOrderFormCellInputType} from 'src/seed/tenantSpecific/featureConfiguration/features/CreateJobOrderForm/enum/createJobOrderFormCellInputType.enum';
import {CreateJobOrderFormCellInputName} from 'src/seed/tenantSpecific/featureConfiguration/features/CreateJobOrderForm/enum/createJobOrderFormCellInputName.enum';
import {CreateJobOrderFormRowPadding} from './enum/createJobOrderFormRowPadding.enum';
import {CreateJobOrderFormFeatureConfiguration} from './interface/createJobOrderFormFeatureConfiguration.interface';

export const defaultCreateJobOrderFormTemporaryConfiguration: CreateJobOrderFormFeatureConfiguration = {
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
          cells: [
            {
              type: CreateJobOrderFormCellType.CustomLabel,
              placeholder: 'workDetails',
            },
          ],
        },
        {
          rowPadding: 'pb-lg-20 work-details',
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
};

/**
 * Get the default feature configuration for the Create Job Order From feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Create Job Order From feature
 */
export const getDefaultCreateJobOrderFormTemporaryConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.CreateJobOrderFormTemporary,
  config: defaultCreateJobOrderFormTemporaryConfiguration,
});
