import {DisableReasonEnum} from 'src/modules/disableReason/disableReason.enum';

/**
 * Feature to control the reasons for disabling accounts
 *
 * @param {DisableReasonEnum[]} reasons - The list with the available options for disabling accounts
 */
export interface DisableReasonsFeatureConfiguration {
  reasons: DisableReasonEnum[];
}
