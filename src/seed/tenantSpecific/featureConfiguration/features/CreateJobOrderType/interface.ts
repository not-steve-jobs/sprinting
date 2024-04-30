/**
 * Feature to control the types of the new Job Orders in the Staffing Requests module
 *
 * @param {number[]} availableTypes - List of ServiceType ids which allows to configure the available order types
 * @param {number} rateType - List or Rate ids which allows to configure the available rate types for the orders
 */
export interface CreateJobOrderTypeFeatureConfiguration {
  availableTypes: number[];
  rateType?: number;
}
