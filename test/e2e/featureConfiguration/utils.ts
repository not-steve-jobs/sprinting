import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.entity';

export const getFeatureConfigurationPrimaryKeys = (
  entity: Partial<FeatureConfiguration>,
): Pick<FeatureConfiguration, 'id'> => {
  return {
    id: entity.id,
  };
};

export const getTestFeatureConfigurationsPrimaryKeys = (
  entities: Partial<FeatureConfiguration>[],
): Pick<FeatureConfiguration, 'id'>[] => {
  return entities.map(getFeatureConfigurationPrimaryKeys);
};
