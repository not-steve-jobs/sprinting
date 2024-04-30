import {FeatureConfigKey} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {
  FeatureConfigKeyName,
  FeatureConfigKeyType,
  FeatureConfigUserRole,
} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';

const id: FeatureConfigKey = {
  key: FeatureConfigKeyName.Id,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
  showWhenAdmin: true,
  showWhenUser: true,
};

const caseCategory: FeatureConfigKey = {
  key: FeatureConfigKeyName.CaseCategory,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
  showWhenAdmin: true,
  showWhenUser: true,
};

const createdAt: FeatureConfigKey = {
  key: FeatureConfigKeyName.CreatedAt,
  type: FeatureConfigKeyType.Date,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
  showWhenAdmin: true,
  showWhenUser: false,
};

const location: FeatureConfigKey = {
  key: FeatureConfigKeyName.Location,
  type: FeatureConfigKeyType.String,
  views: [FeatureConfigUserRole.Admin, FeatureConfigUserRole.Staff],
  showWhenAdmin: true,
  showWhenUser: true,
};

export const communicationsCardKeys = {
  id,
  caseCategory,
  createdAt,
  location,
};
