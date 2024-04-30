import {Injectable} from '@nestjs/common';
import {CloseReasonCacheService} from 'src/appCache/closeReasonCache.service';
import {CloseReason} from './closeReason.entity';
import {CloseReasonRepository} from './closeReason.repository';

@Injectable()
export class CloseReasonService {
  constructor(
    private readonly closeReasonRepository: CloseReasonRepository,
    private readonly cache: CloseReasonCacheService,
  ) {}

  /**
   * Returns CloseReason data by given tenant and close reason ids as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @param {string} reasonId - Id of current close reason
   * @returns {Promise<CloseReasonArguments>} - Promise, retrieving the data
   */
  public async findOne(tenantId: number, reasonId: number): Promise<CloseReason> {
    let result = this.cache.getOneById(tenantId, reasonId);
    if (result) {
      return result;
    }

    result = await this.closeReasonRepository.findOne(tenantId, reasonId);
    this.cache.setOneById(tenantId, reasonId, result);
    return result;
  }

  /**
   * Returns multiple CloseReason items by given tenant id as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {Promise<CloseReasonArguments[]>} - Promise, retrieving the items
   */
  public async getAll(tenantId: number): Promise<CloseReason[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.closeReasonRepository.findAll(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }

  /**
   * Returns multiple CloseReason items, type external, by given tenant id as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {Promise<CloseReasonArguments[]>} - Promise, retrieving the items
   */
  public async getAllExternal(tenantId: number): Promise<CloseReason[]> {
    let result = this.cache.getAllExternalByTenant(tenantId);
    if (result) {
      return result;
    }
    result = await this.closeReasonRepository.findAllExternal(tenantId);
    this.cache.setAllExternalByTenant(tenantId, result);
    return result;
  }

  /**
   * Returns multiple CloseReason items, type internal, by given tenant id as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {Promise<CloseReasonArguments[]>} - Promise, retrieving the items
   */
  public async getAllInternal(tenantId: number): Promise<CloseReason[]> {
    let result = this.cache.getAllInternalByTenant(tenantId);
    if (result) {
      return result;
    }
    result = await this.closeReasonRepository.findAllInternal(tenantId);
    this.cache.setAllInternalByTenant(tenantId, result);
    return result;
  }
}
