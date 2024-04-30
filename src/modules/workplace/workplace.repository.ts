import {Workplace} from './workplace.entity';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';

@EntityRepository(Workplace)
export class WorkplaceRepository extends AbstractRepository<Workplace> {
  private q(): SelectQueryBuilder<Workplace> {
    return this.createQueryBuilder('Workplace');
  }
  /**
   * Fetch one specific Workplace
   *
   * @param {string} locationId - this is location id from Location table (child)
   * @param {string} parentLocationId - this is also location id from Location table, but it represents one level higher in hierarchy (parent)
   * @return {*}  {Promise<Workplace>}
   * @memberof WorkplaceRepository
   */
  public async findOne(locationId: string, parentLocationId: string): Promise<Workplace> {
    return this.manager.findOne(Workplace, {where: {locationId, parentLocationId}});
  }

  public async save(entity: Workplace) {
    return this.manager.save(entity);
  }
  /**
   * Get all workplaces of one Location
   *
   * @param {string} parentLocationId - parent id
   * @return {*}  {Promise<Workplace[]>}
   * @memberof WorkplaceRepository
   */
  public async getAll(parentLocationId: string): Promise<Workplace[]> {
    return this.q()
      .where('"parentLocationId" = :parentLocationId', {parentLocationId})
      .orderBy('Workplace.locationId', 'ASC')
      .getMany();
  }
}
