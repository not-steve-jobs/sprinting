import {FeatureConfigKeyType} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';
import {FeatureConfigFilter} from 'src/modules/featureConfiguration/featureConfiguration.interface';

const createdBy: FeatureConfigFilter = {
  label: 'createdBy',
  placeholder: 'enterName',
  filterField: 'createdBy',
  type: FeatureConfigKeyType.InputFilter,
  entityName: 'id',
  fieldToRender: 'fullName',
  multiple: true,
};

const category: FeatureConfigFilter = {
  label: 'category',
  placeholder: 'selectCategory',
  filterField: 'category',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  multiple: true,
  translate: true,
  arrowIcon: true,
};

const status: FeatureConfigFilter = {
  label: 'status',
  placeholder: 'selectStatus',
  filterField: 'status',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  entityName: 'case',
  translate: true,
  multiple: true,
  arrowIcon: true,
};

const location: FeatureConfigFilter = {
  label: 'location',
  placeholder: 'enterLocation',
  filterField: 'location',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'locationName',
  multiple: true,
};

const creationDateFrom: FeatureConfigFilter = {
  label: 'creationDate',
  placeholder: 'from',
  filterField: 'from',
  type: FeatureConfigKeyType.Date,
  showWithoutDateType: true,
};

const creationDateTo: FeatureConfigFilter = {
  placeholder: 'to',
  filterField: 'to',
  type: FeatureConfigKeyType.Date,
  showWithoutDateType: true,
};

export const communicationsAvailableFilters = {
  createdBy,
  category,
  status,
  location,
  creationDateFrom,
  creationDateTo,
};
