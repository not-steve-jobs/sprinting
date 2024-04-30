/**
 * Describes an experience level option
 *
 * @param {string} id - Id of the option
 * @param {string} label - Label of the option
 * @param {string} additionalLabel - Additional label of the option
 * @param {boolean} translateAdditionalLabel - If the additional label should be translated
 * @param {string} name - Name of the option
 * @param {number} from - The start range value for the experience (from how many years)
 * @param {number} to - The end range value for the experience (to how many years)
 */
export interface CandidatesListFilterExperienceLevelOption {
  id: string;
  label: string;
  name: string;
  additionalLabel: string;
  translateAdditionalLabel: boolean;
  from: number;
  to: number;
}

const underOneYear: CandidatesListFilterExperienceLevelOption = {
  id: '1',
  label: '<1',
  additionalLabel: 'years',
  translateAdditionalLabel: true,
  name: '<1',
  from: 0,
  to: 1,
};

const betweenOneAndTwoYears: CandidatesListFilterExperienceLevelOption = {
  id: '2',
  label: '1-2',
  additionalLabel: 'years',
  translateAdditionalLabel: true,
  name: '1-2',
  from: 1,
  to: 2,
};

const betweenTwoAndFiveYears: CandidatesListFilterExperienceLevelOption = {
  id: '3',
  label: '2-5',
  additionalLabel: 'years',
  translateAdditionalLabel: true,
  name: '2-5',
  from: 2,
  to: 5,
};

const betweenFiveAndTenYears: CandidatesListFilterExperienceLevelOption = {
  id: '4',
  label: '5-10',
  additionalLabel: 'years',
  translateAdditionalLabel: true,
  name: '5-10',
  from: 5,
  to: 10,
};

const betweenTenAndTwentyYears: CandidatesListFilterExperienceLevelOption = {
  id: '5',
  label: '10-20',
  additionalLabel: 'years',
  translateAdditionalLabel: true,
  name: '10-20',
  from: 10,
  to: 20,
};

const overTwentyYears: CandidatesListFilterExperienceLevelOption = {
  id: '6',
  label: '>20',
  additionalLabel: 'years',
  translateAdditionalLabel: true,
  name: '>20',
  from: 20,
  to: 100,
};

export const experienceLevelOptions = {
  underOneYear,
  betweenOneAndTwoYears,
  betweenTwoAndFiveYears,
  betweenFiveAndTenYears,
  betweenTenAndTwentyYears,
  overTwentyYears,
};
