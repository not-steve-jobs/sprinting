import {FeatureConfigKey} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {
  FeatureConfigKeyName,
  FeatureConfigKeyType,
  FeatureConfigUserRole,
} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';

const name: FeatureConfigKey = {
  key: FeatureConfigKeyName.Name,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const status: FeatureConfigKey = {
  key: FeatureConfigKeyName.Status,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const startAndEndDate: FeatureConfigKey = {
  key: FeatureConfigKeyName.StartAndEndDate,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
  format: 'dd.MM.yy',
};

const location: FeatureConfigKey = {
  key: FeatureConfigKeyName.Location,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const noOfPositions: FeatureConfigKey = {
  key: FeatureConfigKeyName.NoOfPositions,
  type: FeatureConfigKeyType.NumberOfPositions,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const role: FeatureConfigKey = {
  key: FeatureConfigKeyName.Role,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

export const staffingRequestsCardKeys = {
  name,
  status,
  startAndEndDate,
  location,
  noOfPositions,
  role,
};
