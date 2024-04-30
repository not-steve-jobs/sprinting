import {Injectable} from '@nestjs/common';
import {SharedErrors} from 'src/core/error/shared.error';
import {DepartmentDto} from './dto/department.dto';
import {DepartmentRepository} from './department.repository';
import {DepartmentCacheService} from 'src/appCache/departmentCache.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly repository: DepartmentRepository, private readonly cache: DepartmentCacheService) {}

  public async findAll(): Promise<DepartmentDto[]> {
    let result = this.cache.getMany();
    if (result) {
      return result;
    }

    result = await this.repository.findAll();
    const dto: DepartmentDto[] = result.map((dept) => ({
      id: dept.id,
      name: dept.name,
      keyName: dept.keyName,
    }));
    this.cache.setMany(dto);
    return dto;
  }

  public async findOne(id: string): Promise<DepartmentDto> {
    let result = this.cache.getOneById(id);
    if (result) {
      return result;
    }

    result = await this.repository.findOneById(id);
    if (!result) {
      throw new SharedErrors.EntityNotFoundError({name: 'Department', id});
    }
    const dto: DepartmentDto = {
      id: result.id,
      name: result.name,
      keyName: result.keyName,
    };
    this.cache.setOneById(id, dto);
    return dto;
  }

  public async findOneByName(name: string): Promise<DepartmentDto> {
    let result = this.cache.getOneByName(name);
    if (result) {
      return result;
    }
    result = await this.repository.findOneByName(name);
    if (!result) {
      throw new SharedErrors.EntityNotFoundError({name: 'Department', id: name});
    }
    const dto: DepartmentDto = {
      id: result.id,
      name: result.name,
      keyName: result.keyName,
    };

    this.cache.setOneByName(name, dto);
    return dto;
  }
}
