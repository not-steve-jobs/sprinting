/**
 * Simply parse a language with locale string and export only the language code
 * Example: en_US -> en
 *
 * @param {string} languageLocale
 * @returns {string}
 */
export const getLanguageCode = (languageLocale: string): string => {
  return languageLocale.substring(0, 2);
};
