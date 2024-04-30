import {MyColleaguesFormFieldMode} from './enum/myColleaguesFormFieldMode';
import {MyColleaguesFormFieldName} from './enum/myColleaguesFormFieldName';
import {MyColleaguesFormFieldType} from './enum/myColleaguesFormFieldType';

interface MyColleaguesFormFieldValidation {
  isRequired?: boolean;
  isDisabled?: boolean;
  isMultiple?: boolean;
  maxChars?: number;
}

interface MyColleaguesFormFieldSwitchValues {
  name: string;
  isHidden?: boolean;
  isDisabled?: boolean;
  isSelectedByDefault?: boolean;
}

export interface MyColleaguesFormField {
  type: MyColleaguesFormFieldType;
  name: MyColleaguesFormFieldName;
  mode: MyColleaguesFormFieldMode;
  label?: string;
  values?: MyColleaguesFormFieldSwitchValues[];
  placeholder?: string;
  icon?: string;
  validation?: MyColleaguesFormFieldValidation;
  styleConfig?: string;
  dependencyField?: string;
}

export interface MyColleaguesFormRow {
  cells: MyColleaguesFormField[];
}

export interface MyColleaguesFormSection {
  title: string;
  isHidden?: boolean;
  rows: MyColleaguesFormRow[];
}

export interface MyColleaguesFormFeatureConfiguration {
  sections: MyColleaguesFormSection[];
}
