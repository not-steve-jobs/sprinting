import {RoleTransco} from 'src/modules/transformations/entities/roleTransco.entity';
import {RoleTranscoData, TranscoTableData} from 'src/modules/transformations/enums/transformations.types';

export const roleTranscoData: RoleTranscoData[] = [
  {roleId: 1, role: 'Client Admin'},
  {roleId: 2, role: 'Client User'},
];

export const roleTranscoKeys = ['roleId'];

export const roleTranscoTableData: TranscoTableData = {
  entity: RoleTransco,
  data: roleTranscoData,
  primaryKeys: roleTranscoKeys,
};
