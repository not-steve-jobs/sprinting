import {CreateJobOrderFormStepRowCell} from './createJobOrderFormStepRowCell.interface';

/**
 * Describes a 'rows' element structure
 *
 *  CreateJobOrderFrom
 *    formSteps
 *      [rows]
 *        cells
 *
 * @param {CreateJobOrderFormStepRowCell[]} cells - List of all cells that a form step's row may contain
 * @param {string} styleConfig - Based on it, a CSS class will be applied to the form step's row
 * @param {string} rowPadding - Leads to addition of a CSS padding to the form step's row
 * @param {boolean} skipWrapping - If the content info 'row' div has to be wrapped
 */
export interface CreateJobOrderFormStepRow {
  cells: CreateJobOrderFormStepRowCell[];
  styleConfig?: string;
  rowPadding?: string;
  skipWrapping?: boolean;
}
