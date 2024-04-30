import {LevelDto} from './dto/level.dto';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Level} from './level.entity';

@EntityRepository(Level)
export class LevelRepository extends AbstractRepository<Level> {
  private q(entityName: string): SelectQueryBuilder<Level> {
    return this.createQueryBuilder('Level').where('"entityName" = :entityName', {entityName});
  }

  public async findAll(): Promise<Level[]> {
    return this.manager.find(Level, {
      order: {
        name: 'ASC',
      },
    });
  }

  public async findOne(id: number, entityName: string): Promise<Level> {
    return this.manager.findOne(Level, {
      where: {id, entityName},
    });
  }

  public async getLevelByNameAndEntity(entityName: string, name: string): Promise<Level> {
    return this.manager.findOne(Level, {
      where: {entityName, name},
    });
  }

  public async save(entity: Level) {
    return this.manager.save(entity);
  }

  public async getAllLevelsByEntityName(entityName: string): Promise<LevelDto[]> {
    return this.q(entityName).select(['Level.name', 'Level.id', 'Level.keyName']).orderBy('id', 'ASC').getMany();
  }

  public async deleteLevels(levelIds: number[]) {
    return this.createQueryBuilder('Level').where('"id" IN (:...levelIds)', {levelIds}).delete().execute();
  }
}
