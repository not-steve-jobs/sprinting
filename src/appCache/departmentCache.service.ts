import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {DepartmentDto} from 'src/modules/department/dto/department.dto';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class DepartmentCacheService {
  private readonly name = CacheEntityName.department;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getMany = (): DepartmentDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allDepartmentKey();
    return this.nodeCache.get<DepartmentDto[]>(key, this.name);
  };

  setMany = (values: DepartmentDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allDepartmentKey();
    this.nodeCache.set<DepartmentDto[]>(key, values, this.name);
  };

  getOneById = (id: string): DepartmentDto | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.departmentIdKey(id);
    return this.nodeCache.get<DepartmentDto>(key, this.name);
  };

  setOneById = (id: string, value: DepartmentDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.departmentIdKey(id);
    this.nodeCache.set<DepartmentDto>(key, value, this.name);
  };

  getOneByName = (name: string): DepartmentDto | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.departmentNameKey(name);
    return this.nodeCache.get<DepartmentDto>(key, this.name);
  };

  setOneByName = (name: string, value: DepartmentDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.departmentNameKey(name);
    this.nodeCache.set<DepartmentDto>(key, value, this.name);
  };

  private allDepartmentKey = () => 'department_all';
  private departmentIdKey = (id: string) => `id_${id}`;
  private departmentNameKey = (name: string) => `name_${name}`;
}
