import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {CaseCategory} from './caseCategory.entity';

@EntityRepository(CaseCategory)
export class CaseCategoryRepository extends AbstractRepository<CaseCategory> {
  private q(): SelectQueryBuilder<CaseCategory> {
    return this.createQueryBuilder('CaseCategory');
  }

  public async findAll(): Promise<CaseCategory[]> {
    return this.q().getMany();
  }

  public async findOne(id: number): Promise<CaseCategory> {
    return this.manager.findOne(CaseCategory, {where: {id}});
  }

  public async findOneByName(name: string): Promise<CaseCategory> {
    return this.manager.findOne(CaseCategory, {where: {name}});
  }

  public async save(entity: CaseCategory) {
    return this.manager.save(entity);
  }

  public async delete(entity: CaseCategory) {
    return this.manager.remove(entity);
  }
}
