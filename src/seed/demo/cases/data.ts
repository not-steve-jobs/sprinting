import {CaseEntityNameEnum} from 'src/modules/case/case.enum';

/**
 * List with demo data used to generate "random" seeds
 */

export const DEMO_SUBJECTS: string[] = [
  'I had a problem...',
  'Question',
  'Something is wrong',
  'I need information',
  'I had an issue',
];

export const DEMO_DESCRIPTIONS: string[] = [
  'I had an issue with filling out the form.',
  "I don't have needed info.",
  'I had an issue with filling out the form.',
  'How to fill out the form.',
];

export const DEMO_ENTITY_NAMES: CaseEntityNameEnum[] = Object.values(CaseEntityNameEnum);
