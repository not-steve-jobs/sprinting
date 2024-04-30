import {AbstractRepository, EntityRepository} from 'typeorm';
import {CloseReasonArguments} from './closeReasonArguments.entity';

@EntityRepository(CloseReasonArguments)
export class CloseReasonArgumentsRepository extends AbstractRepository<CloseReasonArguments> {
  /**
   * Returns data row from database for the given tenant and job order ids as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @param {string} jobOrderId - Id of current job order
   * @returns {Promise<CloseReasonArguments>} - Promise, retrieving the data row from the database
   */
  public async findOne(tenantId: number, jobOrderId: string): Promise<CloseReasonArguments> {
    return this.manager.findOne(CloseReasonArguments, {
      where: {tenantId, jobOrderId},
      relations: ['closeReason'],
      // relations: ['closeReason', 'tenant'], //TODO: add tenant relation (#2355)
    });
  }

  /**
   * Saves a new record in table CloseReasonArguments of the database.
   *
   * @param {CloseReasonArguments} entity - Data for the new record
   * @returns {Promise<CloseReasonArguments>} - Promise, retrieving the saved data
   */
  public async save(entity: CloseReasonArguments): Promise<CloseReasonArguments> {
    return this.manager.save(entity);
  }

  public async delete(entity: CloseReasonArguments) {
    return this.manager.remove(entity);
  }
}
