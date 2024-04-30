import {FeatureConfigKeyType} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';
import {FeatureConfigFilter} from 'src/modules/featureConfiguration/featureConfiguration.interface';

export interface InvoicesFilterOption {
  label: string;
  value: string;
}

const location: FeatureConfigFilter = {
  label: 'location',
  placeholder: 'selectLocations',
  filterField: 'location',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'locationName',
  multiple: true,
};

const status: FeatureConfigFilter = {
  label: 'status',
  placeholder: 'selectStatus',
  filterField: 'status',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  entityName: 'invoice',
  multiple: true,
  translate: true,
};

const dateType: FeatureConfigFilter = {
  label: 'dateType',
  placeholder: 'selectDateType',
  filterField: 'timeFilters',
  fieldToRender: 'name',
  type: FeatureConfigKeyType.InputFilter,
  multiple: false,
  translate: true,
};

const periodFrom: FeatureConfigFilter = {
  label: 'period',
  placeholder: 'periodFrom',
  filterField: 'from',
  type: FeatureConfigKeyType.Date,
};

const periodTo: FeatureConfigFilter = {
  placeholder: 'periodTo',
  filterField: 'to',
  type: FeatureConfigKeyType.Date,
};

const creditNotes: FeatureConfigFilter = {
  label: 'creditNotes',
  filterField: 'creditNotes',
  type: FeatureConfigKeyType.SingleCheckbox,
  options: [{label: 'creditNotes', value: 'creditNotes'}],
};

const overdue: FeatureConfigFilter = {
  label: 'overdue',
  filterField: 'overdue',
  type: FeatureConfigKeyType.SingleCheckbox,
  options: [{label: 'overdue', value: 'overdue'}],
};

const attachments: FeatureConfigFilter = {
  label: 'attachments',
  filterField: 'attachments',
  type: FeatureConfigKeyType.SingleCheckbox,
  options: [{label: 'attachments', value: 'attachments'}],
};

const currency: FeatureConfigFilter = {
  label: 'currency',
  placeholder: 'selectCurrency',
  filterField: 'currency',
  fieldToRender: 'name',
  type: FeatureConfigKeyType.InputFilter,
  multiple: true,
};

export const invoicesAvailableFilters = {
  location,
  status,
  dateType,
  periodFrom,
  periodTo,
  creditNotes,
  overdue,
  attachments,
  currency,
};
