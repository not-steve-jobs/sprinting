import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {CloseReason} from './closeReason.entity';
import {CloseReasonTypeEnum} from './closeReason.enum';

@EntityRepository(CloseReason)
export class CloseReasonRepository extends AbstractRepository<CloseReason> {
  /**
   * Returns a query with provided tenant id for retrieving data from the database.
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {SelectQueryBuilder<CloseReason>} - Query with added tenant id
   */
  private q(tenantId: number): SelectQueryBuilder<CloseReason> {
    return this.createQueryBuilder('CloseReason').where('"CloseReason"."tenantId" = :tenantId', {tenantId});
  }

  /**
   * Returns data row from database for the given tenant and close reason ids as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @param {string} jobOrderId - Id of current close reason
   * @returns {Promise<CloseReason>} - Promise, retrieving the data row from the database
   */
  public async findOne(tenantId: number, id: number): Promise<CloseReason> {
    return this.q(tenantId).andWhere('"CloseReason"."id" = :id', {id}).getOne();
  }

  /**
   * Returns data rows from database for the given tenant id as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {Promise<CloseReason[]>} - Promise, retrieving the data rows from the database
   */
  public async findAll(tenantId?: number): Promise<CloseReason[]> {
    if (tenantId) {
      return this.q(tenantId).getMany();
    }

    return this.manager.find(CloseReason);
  }

  /**
   * Returns data rows from database, type external, for the given tenant id as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {Promise<CloseReason[]>} - Promise, retrieving the data rows from the database
   */
  public async findAllExternal(tenantId: number): Promise<CloseReason[]> {
    const type: string[] = [CloseReasonTypeEnum.External, CloseReasonTypeEnum.Common];
    return this.q(tenantId).andWhere('"CloseReason"."type" IN (:...type)', {type}).getMany();
  }

  /**
   * Returns data rows from database, type internal, for the given tenant id as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {Promise<CloseReason[]>} - Promise, retrieving the data rows from the database
   */
  public async findAllInternal(tenantId: number): Promise<CloseReason[]> {
    const type: string[] = [CloseReasonTypeEnum.Internal, CloseReasonTypeEnum.Common];
    return this.q(tenantId).andWhere('"CloseReason"."type" IN (:...type)', {type}).getMany();
  }

  /**
   * Saves a new record in table CloseReason of the database.
   *
   * @param {CloseReasonArguments} entity - Data for the new record
   * @returns {Promise<CloseReason>} - Promise, retrieving the saved data
   */
  public async save(entity: CloseReason): Promise<CloseReason> {
    return this.manager.save(entity);
  }
}
