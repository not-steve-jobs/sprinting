import {
  FeatureConfigKeyName,
  FeatureConfigKeyType,
} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';
import {FeatureConfigKey} from 'src/modules/featureConfiguration/featureConfiguration.interface';

const number: FeatureConfigKey = {
  key: FeatureConfigKeyName.Number,
  type: FeatureConfigKeyType.String,
};

const hoursBilled: FeatureConfigKey = {
  key: FeatureConfigKeyName.HoursBilled,
  type: FeatureConfigKeyType.Number,
};

const totalAmount: FeatureConfigKey = {
  key: FeatureConfigKeyName.TotalAmount,
  type: FeatureConfigKeyType.Number,
};

const duePaymentDate: FeatureConfigKey = {
  key: FeatureConfigKeyName.DuePaymentDate,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yy',
};

const overdue: FeatureConfigKey = {
  key: FeatureConfigKeyName.Overdue,
  type: FeatureConfigKeyType.String,
};

const status: FeatureConfigKey = {
  key: FeatureConfigKeyName.Status,
  type: FeatureConfigKeyType.Status,
  className: 'web',
};

const issueDate: FeatureConfigKey = {
  key: FeatureConfigKeyName.IssueDate,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yy',
};

const location: FeatureConfigKey = {
  key: FeatureConfigKeyName.Location,
  type: FeatureConfigKeyType.String,
};

export const invoicesCardKeys = {
  number,
  hoursBilled,
  totalAmount,
  duePaymentDate,
  overdue,
  status,
  issueDate,
  location,
};
