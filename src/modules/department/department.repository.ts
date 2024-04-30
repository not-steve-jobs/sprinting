import {AbstractRepository, EntityRepository} from 'typeorm';
import {Department} from './department.entity';

@EntityRepository(Department)
export class DepartmentRepository extends AbstractRepository<Department> {
  findOneById(id: string): Promise<Department> {
    return this.manager.findOne(Department, {
      where: {id},
    });
  }

  findOneByName(name: string): Promise<Department> {
    return this.manager.findOne(Department, {
      where: {name},
    });
  }

  public async findAll(): Promise<Department[]> {
    return this.manager.find(Department, {
      order: {
        name: 'ASC',
      },
    });
  }

  public async save(entity: Department) {
    return this.manager.save(entity);
  }
}
