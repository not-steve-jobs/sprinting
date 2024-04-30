import {Injectable} from '@nestjs/common';
import {SharedErrors} from 'src/core/error/shared.error';
import {DepartmentFunctionDto} from './dto/departmentFunction.dto';
import {DepartmentFunctionRepository} from './departmentFunction.repository';
import {DepartmentFunction} from './departmentFunction.entity';
import {FeatureConfigurationService} from '../featureConfiguration/featureConfiguration.service';
import {FeatureConfigurationFeature} from '../featureConfiguration/enum/featureConfigurationFeature.enum';
import {
  MyColleaguesFormFeatureConfiguration,
  MyColleaguesFormRow,
  MyColleaguesFormSection,
  MyColleaguesFormField,
} from 'src/seed/tenantSpecific/featureConfiguration/features/MyColleaguesForm/interface';
import {FeatureConfiguration} from '../featureConfiguration/featureConfiguration.entity';
import {MyColleaguesFormFieldName} from 'src/seed/tenantSpecific/featureConfiguration/features/MyColleaguesForm/enum/myColleaguesFormFieldName';
import {DepartmentFunctionCacheService} from 'src/appCache/departmentFunctionCache.service';

@Injectable()
export class DepartmentFunctionService {
  constructor(
    private readonly repository: DepartmentFunctionRepository,
    private readonly featureConfigurationService: FeatureConfigurationService,
    private readonly cache: DepartmentFunctionCacheService,
  ) {}

  public async findAll(): Promise<DepartmentFunctionDto[]> {
    let result = this.cache.getMany();
    if (result) {
      return result;
    }

    result = await this.repository.findAll();
    if (!result) {
      throw new SharedErrors.NoEntityNotFoundError({name: 'DepartmentFunction'});
    }
    const dto: DepartmentFunctionDto[] = result.map((departmentFunction: DepartmentFunction) => ({
      id: departmentFunction.id,
      name: departmentFunction.name,
      keyName: departmentFunction.keyName,
      departmentId: departmentFunction.departmentId,
    }));
    this.cache.setMany(dto);
    return dto;
  }

  public async getFunctionById(id: string): Promise<DepartmentFunctionDto> {
    let result = this.cache.getOneById(id);
    if (result) {
      return result;
    }

    result = await this.repository.findOneById(id);
    if (!result) {
      throw new SharedErrors.EntityNotFoundError({name: 'DepartmentFunction', id});
    }
    const dto: DepartmentFunctionDto = {
      id: result.id,
      name: result.name,
      keyName: result.keyName,
      departmentId: result.departmentId,
    };
    this.cache.setOneById(id, dto);
    return dto;
  }

  public async getFunctionsByDepartmentId(departmentId: string): Promise<DepartmentFunctionDto[]> {
    let result = this.cache.getManyByDepartmentId(departmentId);
    if (result) {
      return result;
    }

    result = await this.repository.findFunctionsByDepartmentId(departmentId);
    const dto: DepartmentFunctionDto[] = result.map((departmentFunction) => ({
      id: departmentFunction.id,
      name: departmentFunction.name,
      keyName: departmentFunction.keyName,
      departmentId: departmentFunction.departmentId,
    }));
    this.cache.setManyByDepartmentId(departmentId, dto);
    return dto;
  }

  public async validateDepartmentFunction(
    tenantId: number,
    departmentId: string,
    functionId: string,
  ): Promise<boolean> {
    try {
      if (await this.isDepartmentFunctionEnabled(tenantId)) {
        if (functionId) {
          const fetchedFunction = await this.getFunctionById(functionId);
          if (!fetchedFunction || fetchedFunction.departmentId !== departmentId) {
            return false;
          }
        }
      } else {
        return true;
      }
    } catch {
      return false;
    }
    return true;
  }

  /**
   * Checks if the function field is enabled for the tenant in the MyColleaguesForm feature configuration
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {Promise<boolean>} - Promise, retrieving true or false
   */
  public async isDepartmentFunctionEnabled(tenantId: number): Promise<boolean> {
    const featConfig: FeatureConfiguration = await this.featureConfigurationService.getFeatureConfigurationByFeatureName(
      tenantId,
      FeatureConfigurationFeature.MyColleaguesForm,
    );
    const colleagueFormConfig: MyColleaguesFormFeatureConfiguration = featConfig.config;
    colleagueFormConfig.sections.forEach((section: MyColleaguesFormSection) => {
      section.rows.forEach((row: MyColleaguesFormRow) => {
        row.cells.forEach((field: MyColleaguesFormField) => {
          if (field.name === MyColleaguesFormFieldName.Function) {
            return true;
          }
        });
      });
    });
    return false;
  }
}
