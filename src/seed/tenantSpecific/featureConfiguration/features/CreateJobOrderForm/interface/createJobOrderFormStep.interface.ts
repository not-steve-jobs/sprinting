import {CreateJobOrderFormStepRow} from './createJobOrderFormStepRow.interface';

/**
 * Describes a 'formSteps' element structure
 *
 *  CreateJobOrderFrom
 *    [formSteps]
 *      rows
 *        cells
 *
 * @param {number} stepTitle - The title of the form step
 * @param {CreateJobOrderFormStepRow[]} rows - List of all rows that the form step contains
 */
export interface CreateJobOrderFormStep {
  stepTitle: string;
  rows: CreateJobOrderFormStepRow[];
}
