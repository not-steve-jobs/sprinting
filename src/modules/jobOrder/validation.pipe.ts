import {ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform} from '@nestjs/common';
import {ServiceTypeService} from '../serviceType/serviceType.service';
import {ServiceTypeEnum} from '../serviceType/serviceType.enum';
import {FeatureConfigurationFeature} from '../featureConfiguration/enum/featureConfigurationFeature.enum';
import {UpsertJobOrderDto} from './dto/upsertJobOrder.dto';
import {featureConfigurationsByTenant} from '../../seed/tenantSpecific/featureConfiguration/featureConfiguration.seed';
import {JobOrderCommonFields, JobOrderFields, ServiceTypeNameOption} from './jobOrder.interface';

interface FormStep {
  rows: {
    cells: {
      inputName: string;
      validation: {
        isMandatory: boolean;
      };
    }[];
  }[];
}

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  private tenantId: number;
  private commonFields: JobOrderCommonFields = {
    location: 'locationId',
    branch: 'branchId',
    contractType: 'contractTypeId',
    rate: 'rateId',
    shifts: 'shiftId',
    role: 'jobRoleId',
    sector: 'sectorId',
    days: 'daysInWeek',
    timePicker: ['startTime', 'endTime'],
    experience: 'experienceId',
    timeSheetApprover: 'timeSheetApproverId',
    reportTo: 'reportToId',
    billTo: 'billToId',
    workType: 'workTypeId',
  };

  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const {data} = metadata;
    if (data === 'tenantId') {
      if (!parseInt(value)) {
        throw new HttpException(
          `Validation failed (numeric string is expected) for parameter 'tenantId'`,
          HttpStatus.BAD_REQUEST,
        );
      }
      this.tenantId = value;
      return value;
    }
    const payload: UpsertJobOrderDto = value;
    await this.validate(payload);
    return value;
  }

  private async validate(payload: UpsertJobOrderDto) {
    const serviceTypeName = await this.getServiceTypeName(payload.serviceTypeId);
    const requiredFields = new Set(this.getRequiredFields(serviceTypeName));
    for (const key in payload) {
      requiredFields.delete(key);
    }
    if (requiredFields.size > 0) {
      throw new HttpException(`Missing fields ${JSON.stringify(requiredFields)}`, HttpStatus.BAD_REQUEST);
    }
  }

  private getRequiredFields(serviceTypeName: ServiceTypeNameOption): string[] {
    const {config} = featureConfigurationsByTenant[this.tenantId].find((config) => config.feature === serviceTypeName);
    const fieldMapper = this.getMappedFields(serviceTypeName);
    return config.formSteps.reduce<string[]>((requiredFields, step: FormStep) => {
      step.rows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (cell.validation?.isMandatory) {
            if (fieldMapper[cell.inputName]) {
              if (Array.isArray(fieldMapper[cell.inputName])) {
                requiredFields.push(...fieldMapper[cell.inputName]);
              } else {
                requiredFields.push(fieldMapper[cell.inputName]);
              }
            } else {
              requiredFields.push(cell.inputName);
            }
          }
        });
      });
      return requiredFields;
    }, []);
  }

  private getMappedFields(serviceTypeName: ServiceTypeNameOption): JobOrderFields {
    switch (serviceTypeName) {
      // For JobOrders with temporary contract we need to have both dateStart and dateEnd values
      case FeatureConfigurationFeature.CreateJobOrderFormTemporary:
        return {...this.commonFields, dateRange: ['dateStart', 'dateEnd']};
      // For JobOrders with permanent contract we only have dateStart value, as the contract does not have a specified end date
      case FeatureConfigurationFeature.CreateJobOrderFormPermanent:
        return {...this.commonFields, dateStart: 'dateStart'};
      default:
        throw new HttpException('serviceTypeName is not correct', HttpStatus.BAD_REQUEST);
    }
  }

  private async getServiceTypeName(serviceTypeId: number): Promise<ServiceTypeNameOption> {
    const serviceTypes = await this.serviceTypeService.getAll(this.tenantId);
    const name = serviceTypes.find((serviceType) => serviceType.id === serviceTypeId).name;
    switch (name) {
      case ServiceTypeEnum.Temporary:
        return FeatureConfigurationFeature.CreateJobOrderFormTemporary;
      case ServiceTypeEnum.Permanent:
      case ServiceTypeEnum.PermanentSuccess:
        return FeatureConfigurationFeature.CreateJobOrderFormPermanent;
      default:
        throw new HttpException('serviceTypeId is not correct', HttpStatus.BAD_REQUEST);
    }
  }
}
