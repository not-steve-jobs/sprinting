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
  width: '230px',
};

const status: FeatureConfigKey = {
  key: FeatureConfigKeyName.Status,
  type: FeatureConfigKeyType.String,
  className: 'staffing-request-web staffing-request-status',
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const startAndEndDate: FeatureConfigKey = {
  key: FeatureConfigKeyName.StartAndEndDate,
  type: FeatureConfigKeyType.CustomObject,
  fields: [
    {
      key: FeatureConfigKeyName.StartAndEndDate,
      type: FeatureConfigKeyType.String,
      subKey: {
        key: FeatureConfigKeyName.Shift,
        type: FeatureConfigKeyType.String,
      },
    },
  ],
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
  type: FeatureConfigKeyType.CustomObject,
  fields: [
    {
      key: FeatureConfigKeyName.NoOfPositions,
      type: FeatureConfigKeyType.NumberOfPositions,
      subKey: {
        key: FeatureConfigKeyName.Role,
        type: FeatureConfigKeyType.String,
      },
    },
  ],
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

export const staffingRequestsWebKeys = {
  name,
  status,
  startAndEndDate,
  location,
  noOfPositions,
};
