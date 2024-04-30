import {JobOrderAssociateStatus} from 'src/modules/status/status.enum';

/**
 * Feature to control the position of the Candidates according to their statuses
 *
 * @param {JobOrderAssociateStatus[]} match - Control the list of statuses which should make the Candidate to appear in the Match tab
 * @param {JobOrderAssociateStatus[]} select - Control the list of statuses which should make the Candidate to appear in the Select tab
 * @param {JobOrderAssociateStatus[]} placedCandidates - Control the list of statuses which should make the Candidate as placed in the Select tab
 */
export interface OrderDetailsListingStatusesFeatureConfiguration {
  match: JobOrderAssociateStatus[];
  select: JobOrderAssociateStatus[];
  placedCandidates: JobOrderAssociateStatus[];
}
