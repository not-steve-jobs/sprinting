import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Language} from './language.entity';

@EntityRepository(Language)
export class LanguageRepository extends AbstractRepository<Language> {
  private q(): SelectQueryBuilder<Language> {
    return this.createQueryBuilder('Language');
  }

  public async findAll(): Promise<Language[]> {
    return this.q().getMany();
  }

  public async findOne(id: string): Promise<Language> {
    return this.q().where('"id" = :id', {id}).getOne();
  }

  public async save(entity: Language) {
    return this.manager.save(entity);
  }

  public async getBySkillCode(infoSkillCode: string) {
    return this.manager.findOne(Language, {where: {infoSkillCode}});
  }

  public async getByCode(code: string) {
    return this.manager.findOne(Language, {where: {code}});
  }
}
