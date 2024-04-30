import {JobOrderStatus} from 'src/modules/status/status.enum';
import {OrderDetailsJobOrderAction} from './enum/orderDetailsAction.enum';

/**
 * Define all possible sort page options
 */
export enum OrderDetailsActionSortOrder {
  ListingPage = 'listingPage',
  OrderDetailsPageWeb = 'orderDetailsPageWeb',
  OrderDetailsPageMobile = 'orderDetailsPageMobile',
}

/**
 * Define the configuration for the possible actions which can be executed on the Job Orders
 *
 * @param {OrderDetailsJobOrderAction} actionName - The name associated with the action
 * @param {JobOrderStatus[]} displayInStatus - Control when to show the action according to the status of the Job Order
 * @param {OrderDetailsActionSortOrder} sortOrderByPage - Control the order pf the actions on the different pages and views (web or mobile)
 */
interface OrderDetailsActionConfig {
  actionName: OrderDetailsJobOrderAction;
  displayInStatus: JobOrderStatus[];
  sortOrderByPage?: {
    [key in OrderDetailsActionSortOrder]?: number;
  };
}

/**
 * Control the details related with the Cancelled Orders
 *
 * @param {JobOrderStatus} cancelType - // TODO: Document this
 * @param {JobOrderStatus} displayInStatus - // TODO: Document this
 * @param {boolean} hasCancelDetails - // TODO: Document this
 */
interface OrderDetailsCancelDetailConfig {
  cancelType: JobOrderStatus;
  displayInStatus: JobOrderStatus[];
  hasCancelDetails: boolean;
}

/**
 * Feature to control the Order Details Actions
 *
 * @param {OrderDetailsActionConfig[]} actions - List with all of the available actions
 * @param {any[]} cancelDetails - List with mapping for the details related with the Closed Orders
 */
export interface OrderDetailsActionsFeatureConfiguration {
  actions: OrderDetailsActionConfig[];
  cancelDetails: OrderDetailsCancelDetailConfig[];
}
