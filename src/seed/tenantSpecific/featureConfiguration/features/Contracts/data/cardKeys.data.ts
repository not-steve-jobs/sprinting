import {
  FeatureConfigKeyName,
  FeatureConfigKeyType,
} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';
import {FeatureConfigKey} from 'src/modules/featureConfiguration/featureConfiguration.interface';

const location: FeatureConfigKey = {
  key: FeatureConfigKeyName.Location,
  type: FeatureConfigKeyType.String,
};

const dateStart: FeatureConfigKey = {
  key: FeatureConfigKeyName.DateStart,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yyyy',
};

const dateEnd: FeatureConfigKey = {
  key: FeatureConfigKeyName.DateEnd,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yyyy',
};

const type: FeatureConfigKey = {
  key: FeatureConfigKeyName.Type,
  type: FeatureConfigKeyType.String,
};

const associateName: FeatureConfigKey = {
  key: FeatureConfigKeyName.AssociateName,
  type: FeatureConfigKeyType.String,
};

const service: FeatureConfigKey = {
  key: FeatureConfigKeyName.Service,
  type: FeatureConfigKeyType.String,
};

const legalEntity: FeatureConfigKey = {
  key: FeatureConfigKeyName.LegalEntity,
  type: FeatureConfigKeyType.String,
};

const status: FeatureConfigKey = {
  key: FeatureConfigKeyName.Status,
  type: FeatureConfigKeyType.String,
};

const serviceType: FeatureConfigKey = {
  key: FeatureConfigKeyName.ServiceType,
  type: FeatureConfigKeyType.String,
};

export const contractsCardKeys = {
  location,
  dateStart,
  dateEnd,
  type,
  associateName,
  service,
  legalEntity,
  status,
  serviceType,
};
