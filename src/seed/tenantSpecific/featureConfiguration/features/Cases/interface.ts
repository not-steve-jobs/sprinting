import {CaseCategoryType} from 'src/modules/caseCategory/caseCategory.entity';

/**
 * Feature to control the Cases configurations
 *
 * @param {boolean} enableAllCases - A simple feature flag to toggle the status of the Cases module
 * @param {boolean} requireFileDownloadConfirmation - Show a confirmation dialog to the user before downloading a file from a specific category type
 */
export interface CasesFeatureConfiguration {
  enableAllCases: boolean;
  requireFileDownloadConfirmation: CaseCategoryType[];
}
