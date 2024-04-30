import {Currency} from 'src/modules/currency/currency.entity';

/**
 * Feature to control the localization configuration of the tenant
 *
 * @param {Language[]} languages - List with all of the available languages
 * @param {string[]} whitelist - // TODO: Find out and document this property
 * @param {string} fallbackLng - The default fallback language
 * @param {string | null} currencySuffix - Optional param to add a suffix to the currency
 * @param {string | null} currencySpace - Optional parm to control the separation of the currency and the value
 * @param {string} dateFormat - Control the format of the dates
 * @param {string} dateFormatLong - Control the format of the long dates
 */
export interface LocalizationFeatureConfiguration {
  languages: Language[];
  whitelist: string[];
  fallbackLng: string;
  defaultCurrency: Currency;
  currencySuffix: string | null;
  currencySpace: string | null;
  dateFormat: string;
  dateFormatLong: string;
}

/**
 * Describes the structure of a localization object
 *
 * @param {string} code - Localization code
 * @param {string} short - Localization short name
 * @param {string} long - Localization long name
 */
export interface Language {
  code: string;
  short: string;
  long: string;
}
