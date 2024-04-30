import {FeatureConfigKeyType} from 'src/modules/featureConfiguration/enum/featureConfigurationFeatureConfig.enum';
import {FeatureConfigFilter} from 'src/modules/featureConfiguration/featureConfiguration.interface';

const experienceLevel: FeatureConfigFilter = {
  label: 'experienceLevel',
  placeholder: 'selectExperienceLevel',
  filterField: 'experienceLevel',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  entityName: 'candidateList',
  multiple: true,
  arrowIcon: true,
};

const language: FeatureConfigFilter = {
  label: 'language',
  placeholder: 'selectLanguage',
  filterField: 'language',
  fieldToRender: 'name',
  type: FeatureConfigKeyType.InputFilter,
  multiple: true,
};

const location: FeatureConfigFilter = {
  label: 'location',
  placeholder: 'searchByLocation',
  filterField: 'candidates-location',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'locationName',
  multiple: true,
};

const levelOfEducation: FeatureConfigFilter = {
  label: 'levelOfEducation',
  placeholder: 'selectLevelOfEducation',
  filterField: 'levelOfEducation',
  type: FeatureConfigKeyType.InputFilter,
  fieldToRender: 'name',
  multiple: true,
};

export const candidatesListAvailableFilters = {
  experienceLevel,
  language,
  location,
  levelOfEducation,
};
