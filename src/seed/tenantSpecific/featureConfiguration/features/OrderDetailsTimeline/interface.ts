import {JobOrderStatus} from 'src/modules/status/status.enum';

/**
 * Feature to control the Timeline component
 *
 * @param {OrderDetailsTimeLineStage[]} stages - Describe the different stages of the Timeline component
 */
export interface OrderDetailsTimelineFeatureConfiguration {
  stages: OrderDetailsTimeLineStage[];
}

/**
 * Describes a stage of the Order Details Timeline element
 *
 * @param {JobOrderStatus} title
 * @param {string} subtitle
 * @param {string} type - The type of the Timeline component element (React UI Building Blocks)
 * @param {JobOrderStatus} tooltipText - Key used to display a tooltip with more information about the stage
 * @param {JobOrderStatus[]} statuses - List of all JobOrder statuses which will be covered by this stage
 */
export interface OrderDetailsTimeLineStage {
  title: JobOrderStatus;
  subtitle: string;
  type: string;
  tooltipText: JobOrderStatus;
  statuses: [JobOrderStatus];
}
