import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Certification} from './certification.entity';

@EntityRepository(Certification)
export class CertificationRepository extends AbstractRepository<Certification> {
  private q(tenantId: number): SelectQueryBuilder<Certification> {
    return this.createQueryBuilder('Certification').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findOneByName(name: string, tenantId: number): Promise<Certification> {
    return this.manager.findOne(Certification, {
      where: {name, tenantId},
    });
  }

  public async findOneByCertificationId(id: number, tenantId: number): Promise<Certification> {
    return this.manager.findOne(Certification, {
      where: {id, tenantId},
    });
  }

  public async findOneBySkillCode(infoSkillCode: string, tenantId: number): Promise<Certification> {
    return this.manager.findOne(Certification, {
      where: {infoSkillCode, tenantId},
    });
  }

  public async findAll(): Promise<Certification[]> {
    return this.manager.find(Certification);
  }

  public async save(entity: Certification) {
    return this.manager.save(entity);
  }

  public async getTenantCertifications(tenantId: number): Promise<any> {
    return this.q(tenantId).select(['Certification.name', 'Certification.id']).orderBy('id', 'ASC').getMany();
  }
}
