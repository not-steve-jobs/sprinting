import {PlainObject} from '../../../modules/common/common.dto';
import {AuthRoles, AuthRolesEnum} from '../../../core/auth/authRoles';

export const roleData: PlainObject[] = [
  {id: AuthRolesEnum.ClientAdmin, name: AuthRoles.admin},
  {id: AuthRolesEnum.ClientStaff, name: AuthRoles.user},
  {id: AuthRolesEnum.Associate, name: AuthRoles.associate},
  {id: AuthRolesEnum.Candidate, name: AuthRoles.candidate},
  {id: AuthRolesEnum.Common, name: 'common'},
];
