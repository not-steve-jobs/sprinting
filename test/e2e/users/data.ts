import {User} from 'src/modules/user/user.entity';
import {intGuid} from 'src/seed/utils/seed.utils';
import {testChangedClient, testClient} from '../clients/data';
import {testChangedDepartment, testDepartment} from '../department/data';
import {testChangedDepartmentFunction, testDepartmentFunction} from '../departmentFunction/data';
import {DEMO_TITLES} from 'src/seed/demo/users';
import {testPermission} from '../permissions/data';
import {testChangedLocation, testLocation} from '../locations/data';
import {CreateUserDto} from 'src/modules/user/dto/createUser.dto';

export const testUser: Partial<User> = {
  id: intGuid(15),
  B2CId: '12345678-0000-4004-0000-000000000001',
  email: 'test@mail.com',
  clientId: testClient.id,
};

export const createUserResponse: Partial<CreateUserDto> = {
  permissions: [testPermission.id],
  locations: [testLocation.id],
  personalInformation: {
    email: 'testuser@adeccogroup.com',
    firstName: 'John',
    lastName: 'Doe',
    department: testDepartment.id,
    departmentFunction: testDepartmentFunction.id,
    customDepartment: 'Custom Department',
    title: DEMO_TITLES[1],
    mainLocationId: testLocation.id,
    clientId: `${testClient.id}`,
    phonePrefix: 'string',
    phone: 'string',
    otherPhonePrefix: 'string',
    otherPhone: 'string',
  },
};

export const testChangedUser: Partial<CreateUserDto> = {
  permissions: [],
  locations: [testChangedLocation.id],
  invitedByUserId: testUser.id,
  personalInformation: {
    email: testUser.email,
    firstName: 'John',
    lastName: 'Doe',
    department: testChangedDepartment.id,
    departmentFunction: testChangedDepartmentFunction.id,
    title: 'Mr Changed',
    mainLocationId: testChangedLocation.id,
    clientId: testChangedClient.id,
    phonePrefix: 'string',
    phone: 'string',
    otherPhonePrefix: 'string',
    otherPhone: 'string',
  },
};
