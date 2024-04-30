import {RoleService} from './role.service';
import {getTestApp, includeMockRepos} from '../../../test/integretation/test.utils';
import {INestApplication} from '@nestjs/common';
import {RoleRepository} from './role.repository';
import {RoleBuilder} from './role.builder';

describe('RoleService', () => {
  includeMockRepos();

  let app: INestApplication;
  let roleService: RoleService;
  let roleRepository: RoleRepository;

  const testRole = RoleBuilder.standardRoleBuilder().build();

  beforeAll(async () => {
    app = await getTestApp();

    roleService = app.get(RoleService);
    roleRepository = app.get(RoleRepository);
  });

  it('should be defined', () => {
    expect(roleService).toBeDefined();
  });

  it('should return all roles', async () => {
    jest.spyOn(roleRepository, 'findAll').mockImplementation(async () => [testRole, testRole]);
    const roles = await roleService.getAll();

    expect(roles).toBeDefined();
    expect(roleRepository.findAll).toBeCalled();
  });

  it('should return one by ID', async () => {
    jest.spyOn(roleRepository, 'findOneByRoleId').mockImplementation(async () => testRole);
    const roles = await roleService.getRoleById(1);

    expect(roles).toBeDefined();
    expect(roleRepository.findOneByRoleId).toBeCalled();
  });

  it('should return one by Name', async () => {
    jest.spyOn(roleRepository, 'findOneByName').mockImplementation(async () => testRole);
    const roles = await roleService.getRoleByName('test');

    expect(roles).toBeDefined();
    expect(roleRepository.findOneByName).toBeCalled();
  });
});
