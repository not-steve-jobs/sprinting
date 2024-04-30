import {JobOrderStatus} from 'src/modules/status/status.enum';
import {CreateJobOrderFormCellInputName} from '../enum/createJobOrderFormCellInputName.enum';
import {CreateJobOrderFormCellInputType} from '../enum/createJobOrderFormCellInputType.enum';
import {CreateJobOrderFormCellType} from '../enum/createJobOrderFormCellType.enum';

/**
 * Describes a structures of all varieties of a 'cells' element
 *
 *  CreateJobOrderFrom
 *    formSteps
 *      rows
 *        [cells] - interfaces separated by type
 */
export type CreateJobOrderFormStepRowCell =
  | RowCell
  | SelectRowCell
  | DateRowCell
  | InputRowCell
  | InputPlusMinusRowCell
  | DayPickerRowCell
  | LanguagesRowCell
  | CertificationsRowCell
  | TextAreaRowCell
  | InterviewRequiredRowCell
  | UploadFilesRowCell
  | OrderInterviewRequiredRowCell
  | OrderFileListRowCell
  | SectionLabelRowCell
  | DateRangeRowCell
  | CustomLabelRowCell
  | InfoCardRowCell
  | TextInformationRowCell
  | TimePickerRowCell
  | TextGuidanceInformationRowCell;

/**
 * List of all possible elements a cell can have
 *
 * @param type                 - Type of the cell (Mandatory for all cells)
 * @param inputName
 * @param inputType
 * @param label
 * @param ariaLabel
 * @param placeholder
 * @param id
 * @param validation            - Contains a validations rules
 * @param sortOptions           - Option to enable/disable sorting options for select dropdowns
 * @param dependencyField       - Related to branch input because it's dependent on a location input
 * @param styleConfig           - Based on it, a CSS class will be applied to the form step's row
 * @param min                   - A min input value (inputs that handle numbers)
 * @param showInputDescription  - If a input description must be shown (inputs that handle numbers)
 * @param initialValue          - Initial value for day picker
 * @param skipWrapping          - If the content info 'cell' div has to be wrapped
 * @param icons                 - What icons should be used for the different fields (linked dropdown list fields)
 * @param skipWrapping          - If the content info 'cell' div has to be wrapped
 * @param maxChars              - What is the limit number of characters (text area fields)
 * @param iconPosition          - Position of the icon (info cards)
 * @param cardValue             - What value to be displayed (info cards)
 * @param listOfData            - What kind of data to be listed (info cards that are displaying linked dropdown list fields values)
 * @param cellValueType         - Type of the value (info cards)
 * @param timeInterval          - What time interval to be used when generating the select options (time pickers)
 * @param currencySuffix        - A currency suffix (inputs that handle currency values)
 * @param dependencyFields      - Related to branch input because it's dependent on a location input
 * @param disableEditForStatuses          - A List of JobOrderStatuses. Disables the field if the Job order status is present in the array. (edit job order)
 * @param dependencyFieldPlaceholder      - Related to branch input because it's dependent on a location input
 * @param disableStartDateEditForStatuses - Related to branch input because it's dependent on a location input
 */
interface RowCell {
  type: CreateJobOrderFormCellType;
}

interface SelectRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  label: string;
  placeholder: string;
  validation?: RowCellValidation;
  sortOptions?: boolean;
  dependencyField?: string;
  dependencyFieldPlaceholder?: string;
}
interface DateRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  label: string;
  validation?: RowCellValidation;
  styleConfig?: string;
  disableStartDateEditForStatuses?: JobOrderStatus[];
}

interface InputRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  inputType: CreateJobOrderFormCellInputType;
  label: string;
  placeholder: string;
  validation: RowCellValidation;
}

interface InputPlusMinusRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  label: string;
  validation: RowCellValidation;
  min?: number;
  dependencyFields?: string[];
  showInputDescription?: boolean;
  currencySuffix?: string;
  disableEditForStatuses?: JobOrderStatus[];
}

interface DayPickerRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  initialValue: string;
  label: string;
  validation: RowCellValidation;
  styleConfig?: string;
}

interface LanguagesRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  skipWrapping: boolean;
  validation: RowCellValidation;
  icons?: RowCellIcons;
  placeholder?: string;
}

interface CertificationsRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  skipWrapping: boolean;
  validation: RowCellValidation;
  placeholder?: string;
}

interface TextAreaRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  placeholder: string;
  id: string;
  label: string;
  ariaLabel: string;
  styleConfig: string;
  validation: RowCellValidation;
  maxChars?: number;
}

interface InterviewRequiredRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  validation: RowCellValidation;
}

export interface UploadFilesRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  validation: RowCellValidation;
}

interface OrderInterviewRequiredRowCell extends RowCell {
  styleConfig: string;
}

interface OrderFileListRowCell extends RowCell {
  styleConfig: string[];
}

interface SectionLabelRowCell extends RowCell {
  placeholder: string;
}

interface DateRangeRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  validation: RowCellValidation;
  styleConfig: string;
  label?: string;
  disableStartDateEditForStatuses?: JobOrderStatus[];
}

interface CustomLabelRowCell extends RowCell {
  placeholder: string;
}

interface InfoCardRowCell extends RowCell {
  icon: string;
  iconPosition: string;
  label: string;
  cardValue: string | string[];
  listOfData?: string;
  styleConfig?: string;
  cellValueType?: string;
}

interface TextInformationRowCell extends RowCell {
  styleConfig: string;
}

interface TimePickerRowCell extends RowCell {
  inputName: CreateJobOrderFormCellInputName;
  timeInterval: number;
  label: string | TimePickerRowCellLabel;
  placeholder: string;
  validation: RowCellValidation;
  styleConfig: string;
}

interface TextGuidanceInformationRowCell extends RowCell {
  styleConfig: string;
}

/**
 * Describes a structures of some cell elements
 *
 *  CreateJobOrderFrom
 *    formSteps
 *      rows
 *        cells
 *          [*cell element] - interfaces for cell elements
 */
interface RowCellIcons {
  proficiencyLevelIcon?: string;
  languageIcon?: string;
}

interface TimePickerRowCellLabel {
  one: string;
  two: string;
}

interface RowCellValidation {
  isMandatory?: boolean;
  validateList?: ValidationValidateList;
}

interface ValidationValidateList {
  errorPropName?: string;
  type?: string;
}
