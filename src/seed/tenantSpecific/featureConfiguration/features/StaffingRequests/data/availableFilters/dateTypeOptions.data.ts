/**
 * Describes a date type option of an available filter
 *
 * @param {string} id - Id of the option
 * @param {string} label - Label of the option
 * @param {string} name - Name of the option
 * @param {string} type - Type of the option
 */
export interface StaffingRequestsFilterDateTypeOption {
  id: string;
  label: string;
  name: string;
  type: string;
}

const submissionDate: StaffingRequestsFilterDateTypeOption = {
  id: '1',
  label: 'submissionDate',
  name: 'submissionDate',
  type: 'date',
};

const dateStart: StaffingRequestsFilterDateTypeOption = {
  id: '2',
  label: 'dateStart',
  name: 'dateStart',
  type: 'date',
};

const dateEnd: StaffingRequestsFilterDateTypeOption = {
  id: '3',
  label: 'dateEnd',
  name: 'dateEnd',
  type: 'date',
};

export const staffingRequestsFilterDateTypeOptions = {
  submissionDate,
  dateStart,
  dateEnd,
};
