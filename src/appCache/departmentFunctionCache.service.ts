import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {DepartmentFunctionDto} from 'src/modules/departmentFunction/dto/departmentFunction.dto';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class DepartmentFunctionCacheService {
  private readonly name = CacheEntityName.departmentFunction;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getMany = (): DepartmentFunctionDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allDepartmentFunctionKey();
    return this.nodeCache.get<DepartmentFunctionDto[]>(key, this.name);
  };

  setMany = (values: DepartmentFunctionDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allDepartmentFunctionKey();
    this.nodeCache.set<DepartmentFunctionDto[]>(key, values, this.name);
  };

  getOneById = (id: string): DepartmentFunctionDto | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.departmentFunctionIdKey(id);
    return this.nodeCache.get<DepartmentFunctionDto>(key, this.name);
  };

  setOneById = (id: string, value: DepartmentFunctionDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.departmentFunctionIdKey(id);
    this.nodeCache.set<DepartmentFunctionDto>(key, value, this.name);
  };

  getManyByDepartmentId = (departmentId: string): DepartmentFunctionDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.departmentFunctionDepartmentIdKey(departmentId);
    return this.nodeCache.get<DepartmentFunctionDto[]>(key, this.name);
  };

  setManyByDepartmentId = (departmentId: string, values: DepartmentFunctionDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.departmentFunctionDepartmentIdKey(departmentId);
    this.nodeCache.set<DepartmentFunctionDto[]>(key, values, this.name);
  };

  private allDepartmentFunctionKey = () => 'departmentFunction_all';
  private departmentFunctionIdKey = (id: string) => `id_${id}`;
  private departmentFunctionDepartmentIdKey = (departmentId: string) => `departmentId_${departmentId}`;
}
