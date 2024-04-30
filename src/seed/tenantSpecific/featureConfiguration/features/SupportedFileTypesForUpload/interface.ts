/**
 * Feature to control the validations for the uploaded files
 *
 * @param {number} maxFileSizeInMB - The maximum allowed size for the uploaded files (in MB)
 * @param {number} maxNumberOfFiles - The maximum amount of files which you can upload per entity (Case, Job Order, etc.)
 * @param {string[]} supportedFileTypes - List with all supported file types
 * @param {string[]} supportedFileTypesErrorMessage - List with file types which should be displayed when the validation message is displayed
 */
export interface SupportedFileTypesForUploadFeatureConfiguration {
  maxFileSizeInMB: number;
  maxNumberOfFiles: number;
  supportedFileTypes: string[];
  supportedFileTypesErrorMessage: string[];
}
