import {AbstractRepository, EntityRepository} from 'typeorm';
import {DepartmentFunction} from './departmentFunction.entity';

@EntityRepository(DepartmentFunction)
export class DepartmentFunctionRepository extends AbstractRepository<DepartmentFunction> {
  findOneById(id: string): Promise<DepartmentFunction> {
    return this.manager.findOne(DepartmentFunction, {
      where: {id},
      relations: ['department'],
    });
  }

  public async findAll(): Promise<DepartmentFunction[]> {
    return this.manager.find(DepartmentFunction, {
      relations: ['department'],
      order: {
        name: 'ASC',
        department: 'ASC',
      },
    });
  }

  public async save(entity: DepartmentFunction) {
    return this.manager.save(entity);
  }

  public async findFunctionsByDepartmentId(departmentId: string): Promise<DepartmentFunction[]> {
    return this.manager.find(DepartmentFunction, {
      where: {departmentId},
    });
  }
}
