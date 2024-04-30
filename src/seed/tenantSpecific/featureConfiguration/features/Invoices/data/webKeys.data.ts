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
};

const issueDate: FeatureConfigKey = {
  key: FeatureConfigKeyName.IssueDate,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yy',
};

const totalAmount: FeatureConfigKey = {
  key: FeatureConfigKeyName.TotalAmount,
  type: FeatureConfigKeyType.Number,
};

const status: FeatureConfigKey = {
  key: FeatureConfigKeyName.Status,
  type: FeatureConfigKeyType.Status,
  className: 'web',
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

const periodStart: FeatureConfigKey = {
  key: FeatureConfigKeyName.PeriodStart,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yy',
};

const periodEnd: FeatureConfigKey = {
  key: FeatureConfigKeyName.PeriodEnd,
  type: FeatureConfigKeyType.Date,
  format: 'dd.MM.yy',
};

const creditNotes: FeatureConfigKey = {
  key: FeatureConfigKeyName.CreditNotes,
  type: FeatureConfigKeyType.String,
};

const amountBeforeTax: FeatureConfigKey = {
  key: FeatureConfigKeyName.AmountBeforeTax,
  type: FeatureConfigKeyType.Number,
};

const currency: FeatureConfigKey = {
  key: FeatureConfigKeyName.Currency,
  type: FeatureConfigKeyType.String,
};

const attachments = {
  key: FeatureConfigKeyName.Attachments,
  type: FeatureConfigKeyType.Link,
};

export const invoicesWebKeys = {
  number,
  location,
  issueDate,
  totalAmount,
  status,
  duePaymentDate,
  overdue,
  periodStart,
  periodEnd,
  creditNotes,
  amountBeforeTax,
  currency,
  attachments,
};
