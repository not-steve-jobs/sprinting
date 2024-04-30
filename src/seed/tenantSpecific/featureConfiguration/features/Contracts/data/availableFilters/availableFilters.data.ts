import {FeatureConfigKeyType} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';
import {FeatureConfigFilter} from 'src/modules/featureConfiguration/featureConfiguration.interface';

const location: FeatureConfigFilter = {
  label: 'location',
  placeholder: 'selectLocations',
  filterField: 'location',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'locationName',
  multiple: true,
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

const status: FeatureConfigFilter = {
  label: 'status',
  placeholder: 'selectStatus',
  filterField: 'status',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  entityName: 'contract',
  multiple: true,
  translate: true,
};

const contractType: FeatureConfigFilter = {
  label: 'contractType',
  placeholder: 'selectContractType',
  filterField: 'type',
  fieldToRender: 'name',
  type: FeatureConfigKeyType.InputFilter,
  entityName: 'contract',
  multiple: true,
  translate: true,
};

const serviceType: FeatureConfigFilter = {
  label: 'serviceType',
  placeholder: 'selectServiceType',
  filterField: 'service',
  fieldToRender: 'name',
  type: FeatureConfigKeyType.InputFilter,
  multiple: true,
  translate: true,
};

const associateName: FeatureConfigFilter = {
  label: 'associateName',
  placeholder: 'selectAssociateName',
  filterField: 'associateName',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'fullName',
  multiple: true,
};

const signedBy: FeatureConfigFilter = {
  label: 'signedBy',
  placeholder: 'signedBy',
  filterField: 'signedBy',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'fullName',
  multiple: true,
};

export const contractsAvailableFilters = {
  location,
  dateType,
  periodFrom,
  periodTo,
  status,
  contractType,
  serviceType,
  associateName,
  signedBy,
};
