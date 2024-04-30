/**
 * Describes a date type option of an available filter
 *
 * @param {string} id - Id of the option
 * @param {string} label - Label of the option
 * @param {string} name - Name of the option
 */
export interface ContractsFilterDateTypeOption {
  id: string;
  label: string;
  name: string;
}

const dateStart: ContractsFilterDateTypeOption = {
  id: '1',
  label: 'dateStart',
  name: 'dateStart',
};

const dateEnd: ContractsFilterDateTypeOption = {
  id: '2',
  label: 'dateEnd',
  name: 'dateEnd',
};

const signatureDate: ContractsFilterDateTypeOption = {
  id: '3',
  label: 'signatureDate',
  name: 'signatureDate',
};

export const contractsFilterDateTypeOptions = {
  dateStart,
  dateEnd,
  signatureDate,
};
