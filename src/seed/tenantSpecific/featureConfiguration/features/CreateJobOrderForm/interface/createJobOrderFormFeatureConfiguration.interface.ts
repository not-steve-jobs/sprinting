import {CreateJobOrderFormStep} from './createJobOrderFormStep.interface';

/**
 * Feature to control the fields and the behavior of the Create Job Order page of the Staffing Requests module
 *
 * @param {number} initialStep - The first step of the Create Order process
 * @param {CreateJobOrderFormStep[]} formSteps = Details and configurations for the layout and the fields on the different form steps
 */
export interface CreateJobOrderFormFeatureConfiguration {
  initialStep: number;
  formSteps: CreateJobOrderFormStep[];
}
