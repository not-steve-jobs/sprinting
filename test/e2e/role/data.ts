import {AuthRoles} from 'src/core/auth/authRoles';
import {Role} from 'src/modules/role/role.entity';

export const testRole: Partial<Role> = {
  id: 1, // TODO: Change this ID when #2726 is done
  name: AuthRoles.admin,
  keyName: 'clientAdmin',
  // createdAt: getTestDate(), // TODO: Change this ID when #2726 is done
  // updatedAt: getTestDate(), // TODO: Change this ID when #2726 is done
};

export const testRoleData: Partial<Role>[] = [
  testRole,
  // TODO: Do we need all of those roles? We can seed them only after #2726 is resolved
  // {id: 1234567892, name: AuthRoles.user, keyName: 'clientStaff', createdAt: getTestDate(), updatedAt: getTestDate()},
  // {id: 1234567893, name: AuthRoles.associate, keyName: 'associate', createdAt: getTestDate(), updatedAt: getTestDate()},
  // {id: 1234567894, name: AuthRoles.candidate, keyName: 'candidate', createdAt: getTestDate(), updatedAt: getTestDate()},
  // {id: 1234567895, name: 'common', keyName: 'common', createdAt: getTestDate(), updatedAt: getTestDate()},
];
