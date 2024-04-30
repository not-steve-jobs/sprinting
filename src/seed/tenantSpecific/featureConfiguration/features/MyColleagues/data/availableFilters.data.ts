import {FeatureConfigKeyType} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';
import {FeatureConfigFilter} from 'src/modules/featureConfiguration/featureConfiguration.interface';

const name: FeatureConfigFilter = {
  label: 'name',
  placeholder: 'enterName',
  filterField: 'name',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'fullName',
  multiple: true,
};

const location: FeatureConfigFilter = {
  label: 'location',
  placeholder: 'enterLocation',
  filterField: 'location',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'locationName',
  multiple: true,
};

const permission: FeatureConfigFilter = {
  label: 'permission',
  placeholder: 'selectPermission',
  filterField: 'permission',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  multiple: true,
  translate: true,
  arrowIcon: true,
  onlyForAdmin: true,
};

const status: FeatureConfigFilter = {
  label: 'status',
  placeholder: 'selectStatus',
  filterField: 'status',
  entityName: 'user',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  multiple: true,
  translate: true,
  arrowIcon: true,
  onlyForAdmin: true,
};

const department: FeatureConfigFilter = {
  label: 'department',
  placeholder: 'selectDepartment',
  filterField: 'department',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  multiple: true,
  arrowIcon: true,
};

const functionFilter: FeatureConfigFilter = {
  label: 'function',
  placeholder: 'selectFunction',
  filterField: 'function',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  multiple: true,
  arrowIcon: true,
};

const userType: FeatureConfigFilter = {
  label: 'userType',
  placeholder: 'selectUserType',
  filterField: 'userType',
  fieldToRender: 'name',
  type: FeatureConfigKeyType.InputFilter,
  multiple: true,
  translate: true,
  arrowIcon: true,
  options: [
    {id: '1', label: 'user', name: 'client-staff'},
    {id: '2', label: 'admin', name: 'client-admin'},
  ],
};

export const myColleaguesAvailableFilters = {
  name,
  location,
  permission,
  status,
  department,
  functionFilter,
  userType,
};
