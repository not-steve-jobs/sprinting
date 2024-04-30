import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {currencyEUR} from 'src/seed/essential/data/currency.data';
import {localizationLanguages} from './data/languages.data';
import {LocalizationFeatureConfiguration} from './interface';

export const defaultLocalizationFeatureConfiguration: LocalizationFeatureConfiguration = {
  languages: [localizationLanguages.englishUsa],
  whitelist: [localizationLanguages.english.code, localizationLanguages.englishUsa.code],
  fallbackLng: localizationLanguages.english.code,
  defaultCurrency: currencyEUR,
  currencySuffix: null,
  currencySpace: null,
  dateFormat: 'dd/MM/yyyy',
  dateFormatLong: 'dddd D MMMM',
};

/**
 * Get the default feature configuration for the Localization feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Localization feature
 */
export const getDefaultLocalizationFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.Localization,
  config: defaultLocalizationFeatureConfiguration,
});
