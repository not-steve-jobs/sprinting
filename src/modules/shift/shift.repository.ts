import {ShiftListDto} from './dto/shiftList.dto';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Shift} from './shift.entity';

@EntityRepository(Shift)
export class ShiftRepository extends AbstractRepository<Shift> {
  private q(tenantId: number): SelectQueryBuilder<Shift> {
    return this.createQueryBuilder('Shift').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findOne(id: number, tenantId: number): Promise<Shift> {
    return this.manager.findOne(Shift, {where: {id, tenantId}});
  }

  public async findAll(): Promise<Shift[]> {
    return this.manager.find(Shift);
  }

  public async save(entity: Shift) {
    return this.manager.save(entity);
  }

  public async getAll(tenantId: number): Promise<ShiftListDto[]> {
    return this.q(tenantId).select(['Shift.name', 'Shift.id', 'Shift.keyName']).orderBy('id', 'ASC').getMany();
  }
}
