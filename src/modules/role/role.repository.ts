import {AbstractRepository, EntityRepository} from 'typeorm';
import {Role} from './role.entity';

@EntityRepository(Role)
export class RoleRepository extends AbstractRepository<Role> {
  public async findOneByName(name: string): Promise<Role> {
    return this.manager.findOne(Role, {where: {name}});
  }

  public async findOneByRoleId(id: number): Promise<Role> {
    return this.manager.findOne(Role, {where: {id}});
  }

  public async findAll(): Promise<Role[]> {
    return this.manager.find(Role);
  }

  public async save(entity: Role) {
    return this.manager.save(entity);
  }
}
