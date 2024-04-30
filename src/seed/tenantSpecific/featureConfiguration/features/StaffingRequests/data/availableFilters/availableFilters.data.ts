import {FeatureConfigKeyType} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';
import {FeatureConfigFilter} from 'src/modules/featureConfiguration/featureConfiguration.interface';

const orderStatus: FeatureConfigFilter = {
  label: 'orderStatus',
  placeholder: 'selectStatus',
  filterField: 'status',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  entityName: 'jobOrder',
  multiple: true,
  translate: true,
  arrowIcon: true,
};

const createdBy: FeatureConfigFilter = {
  label: 'createdBy',
  placeholder: 'enterName',
  filterField: 'name',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'fullName',
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
  arrowIcon: true,
};

const dateRangeFrom: FeatureConfigFilter = {
  label: 'dateRange',
  placeholder: 'from',
  filterField: 'from',
  type: FeatureConfigKeyType.Date,
};

const dateRangeTo: FeatureConfigFilter = {
  placeholder: 'to',
  filterField: 'to',
  type: FeatureConfigKeyType.Date,
};

const serviceType: FeatureConfigFilter = {
  label: 'serviceType',
  placeholder: 'selectServiceType',
  filterField: 'serviceType',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
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

const role: FeatureConfigFilter = {
  label: 'role',
  placeholder: 'selectRole',
  filterField: 'role',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  multiple: true,
};

export const staffingRequestsAvailableFilters = {
  orderStatus,
  createdBy,
  dateType,
  dateRangeFrom,
  dateRangeTo,
  serviceType,
  location,
  role,
};
