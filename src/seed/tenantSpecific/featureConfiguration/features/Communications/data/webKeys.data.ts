import {FeatureConfigKey} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {
  FeatureConfigKeyName,
  FeatureConfigKeyType,
  FeatureConfigUserRole,
} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';

const subject: FeatureConfigKey = {
  key: FeatureConfigKeyName.Subject,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const status: FeatureConfigKey = {
  key: FeatureConfigKeyName.Status,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const statusWithSubKey: FeatureConfigKey = {
  key: FeatureConfigKeyName.Status,
  type: FeatureConfigKeyType.Status,
  subKey: {
    key: FeatureConfigKeyName.UpdatedAt,
    type: FeatureConfigKeyType.Date,
    format: 'calendar',
    label: 'lastUpdate',
  },
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const location: FeatureConfigKey = {
  key: FeatureConfigKeyName.Location,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const nameAndImage: FeatureConfigKey = {
  key: FeatureConfigKeyName.NameAndImage,
  type: FeatureConfigKeyType.CustomObject,
  fields: [
    {
      key: FeatureConfigKeyName.Name,
      type: FeatureConfigKeyType.String,
    },
  ],
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const nameAndImageWithSubKey: FeatureConfigKey = {
  ...nameAndImage,
  fields: [
    {
      key: FeatureConfigKeyName.Name,
      type: FeatureConfigKeyType.String,
      subKey: {
        key: FeatureConfigKeyName.CreatedAt,
        type: FeatureConfigKeyType.Date,
        format: 'DD/MM/YY',
      },
    },
  ],
};

const caseCategory: FeatureConfigKey = {
  key: FeatureConfigKeyName.CaseCategory,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
};

const caseCategoryWithSubKey: FeatureConfigKey = {
  key: FeatureConfigKeyName.CaseCategory,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
  subKey: {
    key: FeatureConfigKeyName.ShortId,
    type: FeatureConfigKeyType.String,
  },
};

export const communicationsWebKeys = {
  subject,
  status,
  statusWithSubKey,
  location,
  nameAndImage,
  nameAndImageWithSubKey,
  caseCategory,
  caseCategoryWithSubKey,
};
