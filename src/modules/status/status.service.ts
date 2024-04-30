import {Status} from './status.entity';
import {Injectable} from '@nestjs/common';
import {StatusRepository} from './status.repository';
import {StatusDto} from './dto/status.dto';
import {StatusCacheService} from 'src/appCache/statusCache.service';

@Injectable()
export class StatusService {
  constructor(private readonly statusRepository: StatusRepository, private readonly cache: StatusCacheService) {}

  public async getAll(tenantId: number): Promise<StatusDto[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.statusRepository.getAll(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }

  public async getStatusByName(tenantId: number, name: string, entityName: string): Promise<StatusDto> {
    let result = this.cache.getOneByNameAndEntityName(tenantId, name, entityName);
    if (result) {
      return result;
    }

    result = await this.statusRepository.findOne(tenantId, name, entityName);
    this.cache.setOneByNameAndEntityName(tenantId, name, entityName, result);
    return result;
  }

  public async getStatusById(tenantId: number, id: number, entityName: string): Promise<StatusDto> {
    let result = this.cache.getOneByIdAndEntityName(tenantId, id, entityName);
    if (result) {
      return result;
    }

    result = await this.statusRepository.findOneById(tenantId, id, entityName);
    this.cache.setOneByIdAndEntityName(tenantId, id, entityName, result);
    return result;
  }

  public async getAllByIds(tenantId: number, statusIds: number[]): Promise<Status[]> {
    let result = this.cache.getManyById(tenantId, statusIds);
    if (result) {
      return result;
    }

    result = await this.statusRepository.getAllByIds(tenantId, statusIds);
    this.cache.setManyById(tenantId, result);
    return result;
  }

  public async getStatusesByEntityName(tenantId: number, entityName: string): Promise<StatusDto[]> {
    let result = this.cache.getOneByEntityName(tenantId, entityName);
    if (result) {
      return result;
    }

    result = await this.statusRepository.findByEntityName(tenantId, entityName);
    this.cache.setOneByEntityName(tenantId, entityName, result);
    return result;
  }
}
