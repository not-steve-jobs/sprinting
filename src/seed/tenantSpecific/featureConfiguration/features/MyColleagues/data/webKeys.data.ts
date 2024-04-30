import {FeatureConfigKey} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {
  FeatureConfigKeyName,
  FeatureConfigKeyType,
  FeatureConfigUserRole,
} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';

const nameAndImage: FeatureConfigKey = {
  key: FeatureConfigKeyName.NameAndImage,
  type: FeatureConfigKeyType.CustomObject,
  fields: [
    {
      key: FeatureConfigKeyName.Name,
      type: FeatureConfigKeyType.String,
      subKey: {
        key: FeatureConfigKeyName.Title,
        type: FeatureConfigKeyType.String,
      },
    },
  ],
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const status: FeatureConfigKey = {
  key: FeatureConfigKeyName.Status,
  type: FeatureConfigKeyType.Status,
  className: 'my-colleagues-web',
  views: [FeatureConfigUserRole.Admin],
};

const userType: FeatureConfigKey = {
  key: FeatureConfigKeyName.UserType,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const worksite: FeatureConfigKey = {
  key: FeatureConfigKeyName.Worksite,
  type: FeatureConfigKeyType.Array,
  views: [FeatureConfigUserRole.Admin],
};

const permissions: FeatureConfigKey = {
  key: FeatureConfigKeyName.Permissions,
  type: FeatureConfigKeyType.Array,
  views: [FeatureConfigUserRole.Admin],
};

const department: FeatureConfigKey = {
  key: FeatureConfigKeyName.Department,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Staff],
};

const functionKey: FeatureConfigKey = {
  key: FeatureConfigKeyName.Function,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Staff],
};

const mainLocation: FeatureConfigKey = {
  key: FeatureConfigKeyName.MainLocation,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Staff],
};

export const myColleaguesWebKeys = {
  nameAndImage,
  status,
  userType,
  worksite,
  permissions,
  department,
  functionKey,
  mainLocation,
};
