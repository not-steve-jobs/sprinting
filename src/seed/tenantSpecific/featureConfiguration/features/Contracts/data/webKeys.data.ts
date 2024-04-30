import {
  FeatureConfigKeyName,
  FeatureConfigKeyType,
} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';
import {FeatureConfigKey} from 'src/modules/featureConfiguration/featureConfiguration.interface';

const number: FeatureConfigKey = {
  key: FeatureConfigKeyName.Number,
  type: FeatureConfigKeyType.String,
};

const location: FeatureConfigKey = {
  key: FeatureConfigKeyName.Location,
  type: FeatureConfigKeyType.String,
  width: '190px',
};

const associateName: FeatureConfigKey = {
  key: FeatureConfigKeyName.AssociateName,
  type: FeatureConfigKeyType.String,
};

const dateStart: FeatureConfigKey = {
  key: FeatureConfigKeyName.DateStart,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yy',
};

const dateEnd: FeatureConfigKey = {
  key: FeatureConfigKeyName.DateEnd,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yy',
};

const status: FeatureConfigKey = {
  key: FeatureConfigKeyName.Status,
  type: FeatureConfigKeyType.Status,
  className: 'web',
};

const type: FeatureConfigKey = {
  key: FeatureConfigKeyName.Type,
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

const signatureDate: FeatureConfigKey = {
  key: FeatureConfigKeyName.SignatureDate,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yy',
};

const signedBy: FeatureConfigKey = {
  key: FeatureConfigKeyName.SignedBy,
  type: FeatureConfigKeyType.String,
};

const serviceType: FeatureConfigKey = {
  key: FeatureConfigKeyName.ServiceType,
  type: FeatureConfigKeyType.String,
};

export const contractsWebKeys = {
  number,
  location,
  associateName,
  dateStart,
  dateEnd,
  status,
  type,
  service,
  legalEntity,
  signatureDate,
  signedBy,
  serviceType,
};
