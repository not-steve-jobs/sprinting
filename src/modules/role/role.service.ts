import {Injectable} from '@nestjs/common';
import {RoleCacheService} from 'src/appCache/roleCache.service';
import {RoleDto} from './dto/role.dto';
import {RoleRepository} from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository, private readonly cache: RoleCacheService) {}

  public async getRoleByName(name: string): Promise<RoleDto> {
    let result = this.cache.getOneByName(name);
    if (result) {
      return result;
    }

    result = await this.repository.findOneByName(name);
    this.cache.setOneByName(result);
    return result;
  }

  public async getRoleById(id: number): Promise<RoleDto> {
    let result = this.cache.getOneByRoleId(id);
    if (result) {
      return result;
    }

    result = await this.repository.findOneByRoleId(id);
    this.cache.setOneByRoleId(result);
    return result;
  }

  public async getAll(): Promise<RoleDto[]> {
    let result = this.cache.getMany();
    if (result) {
      return result;
    }

    result = await this.repository.findAll();
    this.cache.setMany(result);
    return result;
  }
}
