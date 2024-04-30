import {PlainObject} from './../common/common.dto';
import {logger} from '@azure/storage-blob';
import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import {ConsoleService} from 'nestjs-console';
import {DepartmentFunctionService} from '../departmentFunction/departmentFunction.service';
import {RoleService} from '../role/role.service';
import {ServiceTypeService} from '../serviceType/serviceType.service';
import {DepartmentService} from './../department/department.service';
import {JobRoleService} from './../jobRole/jobRole.service';
import {LevelService} from './../level/level.service';
import {RateService} from './../rate/rate.service';
import {SectorService} from './../sector/sector.service';
import {ShiftService} from './../shift/shift.service';
import {tenantData} from '../../seed/tenantSpecific/data/tenant.data';

interface TranslatableEntityConfig {
  entityName: string;
  getterFnName: string;
  valueFieldName: string;
  service:
    | DepartmentService
    | DepartmentFunctionService
    | LevelService
    | RoleService
    | JobRoleService
    | RateService
    | SectorService
    | ServiceTypeService
    | ShiftService;
}

interface TranslatableRecord {
  id: string | number;
  name: string;
  keyName: string;
}

interface TranslatableEntityRecordsResponse {
  entityName: string;
  valueFieldName: string;
  records: TranslatableRecord[];
}

@Injectable()
export class TranslationService {
  private tenantIds: number[];
  private entitiesConfig: TranslatableEntityConfig[];
  private entitesRelatedToTenantConfig: TranslatableEntityConfig[];

  constructor(
    private readonly consoleService: ConsoleService,
    private readonly departmentService: DepartmentService,
    private readonly departmentFunctionService: DepartmentFunctionService,
    private readonly levelService: LevelService,
    private readonly roleService: RoleService,
    private readonly jobRoleService: JobRoleService,
    private readonly rateService: RateService,
    private readonly sectorService: SectorService,
    private readonly serviceTypeService: ServiceTypeService,
    private readonly shiftService: ShiftService,
  ) {
    this.tenantIds = tenantData.map((t) => t.id);
    this.entitiesConfig = this.getConfigs();
    this.entitesRelatedToTenantConfig = this.getTenantRelatedConfigs();
    this.registerFilesGenerationCommand();
  }

  private getConfigs(): TranslatableEntityConfig[] {
    return [
      {entityName: 'departments', service: this.departmentService, getterFnName: 'findAll', valueFieldName: 'name'},
      {
        entityName: 'departmentFunctions',
        service: this.departmentFunctionService,
        getterFnName: 'findAll',
        valueFieldName: 'name',
      },
      {entityName: 'levels', service: this.levelService, getterFnName: 'findAll', valueFieldName: 'name'},
      {entityName: 'roles', service: this.roleService, getterFnName: 'getAll', valueFieldName: 'name'},
    ];
  }

  private getTenantRelatedConfigs(): TranslatableEntityConfig[] {
    return [
      {entityName: 'jobRoles', service: this.jobRoleService, getterFnName: 'getAll', valueFieldName: 'name'},
      {entityName: 'rates', service: this.rateService, getterFnName: 'getAll', valueFieldName: 'name'},
      {entityName: 'sectors', service: this.sectorService, getterFnName: 'getAll', valueFieldName: 'name'},
      {entityName: 'serviceTypes', service: this.serviceTypeService, getterFnName: 'getAll', valueFieldName: 'name'},
      {entityName: 'shifts', service: this.shiftService, getterFnName: 'getAll', valueFieldName: 'name'},
    ];
  }

  private getFormattedFileName(name: string): string {
    // Get filename following the format of the other translation files used in Weblate(examples: word1, word1-word2).
    return (
      name
        // Insert a space before all caps.
        .replace(/([A-Z])/g, ' $1')
        // Replace spaces with '-' symbol.
        .replace(/\s/g, '-')
        // Use lowercase for all letters.
        .toLowerCase()
    );
  }

  private registerFilesGenerationCommand() {
    const cli = this.consoleService.getCli();
    this.generateTranslations = this.generateTranslations.bind(this);
    // To generate the translation files run the following command: npm run console:dev g-translations
    this.consoleService.createCommand(
      {
        command: 'g-translations',
        description: 'Generate translation JSON files for all translatable entities',
      },
      this.generateTranslations,
      cli,
    );
  }

  private async getEntitiesRecords(): Promise<TranslatableEntityRecordsResponse[]> {
    const promises = this.entitiesConfig.map(async (config: TranslatableEntityConfig) => {
      const {entityName, service, getterFnName, valueFieldName} = config;
      const records = await service[getterFnName]();
      return {
        entityName,
        valueFieldName,
        records,
      };
    });
    return await Promise.all(promises);
  }

  private async getTenantRelatedRecords(): Promise<TranslatableEntityRecordsResponse[]> {
    const promises = this.entitesRelatedToTenantConfig.map(async (config: TranslatableEntityConfig) => {
      const {entityName, service, getterFnName, valueFieldName} = config;
      // Some of the translation records are different for the different tenants. We need to translate them all,
      // so we iterate by tenantIds and gather all the translation records from the service.
      const tenantIdsPromises = this.tenantIds.map(async (tenantId) => {
        return await service[getterFnName](tenantId);
      });
      const records = await Promise.all(tenantIdsPromises.flat());
      return {
        entityName,
        valueFieldName,
        records: records.flat(),
      };
    });
    return await Promise.all(promises);
  }

  private async getTranslatableEntitesRecords(): Promise<TranslatableEntityRecordsResponse[]> {
    const records = await this.getEntitiesRecords();
    const relatedRecords = await this.getTenantRelatedRecords();
    return [...records, ...relatedRecords];
  }

  private generateJSON(records: TranslatableRecord[], valueFieldName: string): PlainObject {
    const translation: PlainObject = {};

    records.forEach((record) => {
      const key = record.keyName;
      const value = record[valueFieldName];
      // Do not allow for duplicate keys in the generated translation.
      if (translation[key]) return;
      translation[key] = value;
    });

    return translation;
  }

  private generateFiles(recordsResponseData: TranslatableEntityRecordsResponse[]) {
    const rootDir = process.cwd();
    // Generate translation JSON file for every translatable entity.
    recordsResponseData.forEach((responseData: TranslatableEntityRecordsResponse) => {
      const {entityName, valueFieldName, records} = responseData;
      try {
        const fileName = this.getFormattedFileName(entityName);
        const fileContent = this.generateJSON(records, valueFieldName);
        fs.writeFileSync(`${rootDir}/translations/${fileName}.json`, JSON.stringify(fileContent, null, 2));
      } catch (err) {
        logger.error(`Error on generating translation file for "${entityName}"!`);
        console.log(`Error on generating translation file for "${entityName}"!`); // eslint-disable-line no-console
        return;
      }
      logger.info(`Translation file for "${entityName}" is generated successfully!`);
      console.log(`Translation file for "${entityName}" is generated successfully!`); // eslint-disable-line no-console
    });
  }

  private async generateTranslations() {
    const recordsResponseData: TranslatableEntityRecordsResponse[] = await this.getTranslatableEntitesRecords();
    this.generateFiles(recordsResponseData);
  }
}
