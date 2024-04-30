import {SectorListDto} from './dto/sectorList.dto';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Sector} from './sector.entity';

@EntityRepository(Sector)
export class SectorRepository extends AbstractRepository<Sector> {
  private q(tenantId: number): SelectQueryBuilder<Sector> {
    return this.createQueryBuilder('Sector').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findOne(id: number, tenantId: number): Promise<Sector> {
    return this.manager.findOne(Sector, {where: {id, tenantId}});
  }

  public async save(entity: Sector) {
    return this.manager.save(entity);
  }

  public async getAll(tenantId: number): Promise<SectorListDto[]> {
    return this.q(tenantId).select(['Sector.name', 'Sector.id', 'Sector.keyName']).orderBy('id', 'ASC').getMany();
  }
}
