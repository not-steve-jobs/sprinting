import {CreateJobOrderFormCellInputName} from '../enum/createJobOrderFormCellInputName.enum';
import {CreateJobOrderFormCellType} from '../enum/createJobOrderFormCellType.enum';
import {UploadFilesRowCell} from '../interface/createJobOrderFormStepRowCell.interface';

// Show button to upload more files
const attachedFilesField: UploadFilesRowCell = {
  type: CreateJobOrderFormCellType.UploadFiles,
  inputName: CreateJobOrderFormCellInputName.AttachedFiles,
  validation: {
    isMandatory: false,
  },
};

// Calendar for selecting start date for permanent job orders
const dateStartField = {
  type: CreateJobOrderFormCellType.SingleDatePicker,
  inputName: CreateJobOrderFormCellInputName.DateStart,
  label: 'dateStart',
  validation: {
    isMandatory: true,
  },
  styleConfig: 'cellDouble',
};

// Message related to PES(public employment services) registration of the job order
const pesRegistrationMessage = {
  type: CreateJobOrderFormCellType.PesRegistrationMessage,
  styleConfig: 'cellDouble',
};

export const jobOrderFormFields = {
  attachedFilesField,
  dateStartField,
  pesRegistrationMessage,
};
