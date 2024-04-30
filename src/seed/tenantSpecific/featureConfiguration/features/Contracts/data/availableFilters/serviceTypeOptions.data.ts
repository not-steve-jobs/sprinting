/**
 * Describes a service type option of an available filter
 *
 * @param {string} id - Id of the option
 * @param {string} label - Label of the option
 * @param {string} name - Name of the option
 */
export interface ContractsFilterServiceTypeOption {
  id: string;
  label: string;
  name: string;
}

const delegation: ContractsFilterServiceTypeOption = {
  id: '1',
  label: 'delegation',
  name: 'delegation',
};

const payrolling: ContractsFilterServiceTypeOption = {
  id: '2',
  label: 'payrolling',
  name: 'payrolling',
};

const delegationEtudiant: ContractsFilterServiceTypeOption = {
  id: '3',
  label: 'delegationEtudiant',
  name: 'delegationEtudiant',
};

const payrollingEtudiant: ContractsFilterServiceTypeOption = {
  id: '4',
  label: 'payrollingEtudiant',
  name: 'payrollingEtudiant',
};

const tem: ContractsFilterServiceTypeOption = {
  id: '1',
  label: 'tem',
  name: 'tem',
};

const civilContracts: ContractsFilterServiceTypeOption = {
  id: '2',
  label: 'civilContracts',
  name: 'civilContracts',
};

const perm: ContractsFilterServiceTypeOption = {
  id: '3',
  label: 'perm',
  name: 'perm',
};

const hrCounsulting: ContractsFilterServiceTypeOption = {
  id: '4',
  label: 'hrCounsulting',
  name: 'hrCounsulting',
};

export const serviceTypeOptions = {
  delegation,
  payrolling,
  delegationEtudiant,
  payrollingEtudiant,
  tem,
  civilContracts,
  perm,
  hrCounsulting,
};
