import {CommonIntegrationError} from '../../commonIntegration.error';
import {LanguageService} from './../../../language/language.service';
import {CertificationService} from './../../../certification/certification.service';
import {JobOrderCertificationService} from './../../../jobOrderCertification/jobOrderCertification.service';
import {JobRoleService} from './../../../jobRole/jobRole.service';
import {JobOrderLanguageService} from './../../../jobOrderLanguage/jobOrderLanguage.service';
import {SkillType} from './../eventModels/skill.enum';
import {JobOrderCertification} from './../../../jobOrderCertification/jobOrderCertification.entity';
import {JobOrderLanguage} from './../../../jobOrderLanguage/jobOrderLanguage.entity';
import {JobOrderService} from '../../../jobOrder/jobOrder.service';
import {TenantService} from '../../../tenant/tenant.service';
import {Logger} from '../../../../core/logger';
import {Injectable} from '@nestjs/common';
import {InfoSystemEvent, JobSkillCreatedData, JobSkillUpdatedData, JobSkillDeletedData} from '../eventModels';
import {InfoSystemError} from '../infoSystem.error';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';

@Injectable()
export class SkilsEventsService {
  private started: boolean = false;

  public constructor(
    private readonly logger: Logger,
    private readonly tenantService: TenantService,
    private readonly jobOrderService: JobOrderService,
    private readonly jobOrderLanguageService: JobOrderLanguageService,
    private readonly languageService: LanguageService,
    private readonly certificationService: CertificationService,
    private readonly jobOrderCertificationService: JobOrderCertificationService,
    private readonly jobRoleService: JobRoleService,
    public transformationsService: TransformationsService,
  ) {}

  private async getEventData(event: InfoSystemEvent<JobSkillCreatedData | JobSkillUpdatedData>) {
    const {
      brand,
      country,
      parameters: {jobId: jobOrderId},
    } = event;
    // find tenant
    const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }
    const tenantId = tenant.id;

    const existingJobOrder = await UtilsHelper.retry(
      async () =>
        this.jobOrderService.findOneByTenantIdAndJobOrderId(
          tenantId,
          jobOrderId,
          false, // dont include status data
          false, // dont include user data
          false, // dont consider 'isDisplayed' flag
        ),
      3,
      1000,
    );
    if (!existingJobOrder) {
      throw new CommonIntegrationError.JobOrderNotFound();
    }

    return [tenant, existingJobOrder];
  }

  private async getLanguage(skillCode: string) {
    const language = await this.languageService.findOneBySkillCode(skillCode);
    if (!language) {
      throw new InfoSystemError.LanguageNotFound();
    }
    return language;
  }

  private async getCertification(skillCode: string, tenantId: number) {
    const certification = await this.certificationService.findOneBySkillCode(tenantId, skillCode);
    if (!certification) {
      throw new InfoSystemError.CertificationNotFound();
    }
    return certification;
  }

  private async getJobRole(skillCode: string, tenantId: number) {
    const jobRole = await this.jobRoleService.findOneBySkillCode(tenantId, skillCode);
    if (!jobRole) {
      throw new InfoSystemError.JobRoleNotFound();
    }
    return jobRole;
  }

  public async jobSkillsCreated(event: InfoSystemEvent<JobSkillCreatedData>) {
    const {jobId: jobOrderId, masterSkillType, skillCode} = event.parameters;
    const [{id: tenantId}, existingJobOrder] = await this.getEventData(event);

    // find skill that should be added
    switch (masterSkillType) {
      case SkillType.Language:
        const language = await this.getLanguage(skillCode);

        // check if the received language already exists for the order
        const existingLanguageForOrder = await this.jobOrderLanguageService.findOne(tenantId, jobOrderId, language.id);
        if (!existingLanguageForOrder) {
          event.keyValues = {
            skillLevel: event.parameters.level,
          };
          const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
            EC_Transformations.jobSkillsCreated,
            event,
            BusMessageTypeEnum.EVENT,
          );
          const jobOrderLanguage = new JobOrderLanguage({
            tenantId,
            jobOrderId,
            languageId: language.id,
            levelId: transformedEvent.parameters.levelId,
          });
          await this.jobOrderLanguageService.create(jobOrderLanguage);
        } else {
          throw new InfoSystemError.LanguageAddedToOrder();
        }
        break;
      case SkillType.Certification:
        const certification = await this.getCertification(skillCode, tenantId);

        // check if the received certification already exists for the order
        const existingCertificationForOrder = await this.jobOrderCertificationService.findOne(
          tenantId,
          jobOrderId,
          certification.id,
        );
        if (!existingCertificationForOrder) {
          const jobOrderCertification = new JobOrderCertification({
            tenantId,
            jobOrderId,
            certificationId: certification.id,
          });
          await this.jobOrderCertificationService.create(jobOrderCertification);
        } else {
          throw new InfoSystemError.CertificationAddedToOrder();
        }
        break;
      case SkillType.JobRole:
        const jobRole = await this.getJobRole(skillCode, tenantId);

        // check if job order already have defined role (jot_title)
        if (!existingJobOrder.jobRoleId) {
          existingJobOrder.jobRoleId = jobRole.id;
          await this.jobOrderService.update(tenantId, jobOrderId, existingJobOrder);
        } else {
          throw new InfoSystemError.JobRoleAddedToOrder();
        }
        break;
      default:
        break;
    }
  }

  public async jobSkillsUpdated(event: InfoSystemEvent<JobSkillUpdatedData>) {
    const {jobId: jobOrderId, masterSkillType, skillCode} = event.parameters;
    const [{id: tenantId}, existingJobOrder] = await this.getEventData(event);

    // find skill that should be updated
    switch (masterSkillType) {
      case SkillType.Language:
        const language = await this.getLanguage(skillCode);

        // check if the received language already exists for the order
        const existingLanguageForOrder = await this.jobOrderLanguageService.findOne(tenantId, jobOrderId, language.id);
        if (!existingLanguageForOrder) {
          throw new InfoSystemError.LanguageNotExistsForOrder();
        } else {
          event.keyValues = {
            skillLevel: event.parameters.level,
          };
          const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
            EC_Transformations.jobSkillsUpdated,
            event,
            BusMessageTypeEnum.EVENT,
          );
          existingLanguageForOrder.levelId = transformedEvent.parameters.levelId;
          await this.jobOrderLanguageService.create(existingLanguageForOrder);
        }
        break;
      case SkillType.Certification:
        // update of certification is meaningless because you can only add or remove certifications
        // and besides certification, we don't have any other info related to certification itself
        break;
      case SkillType.JobRole:
        const jobRole = await this.getJobRole(skillCode, tenantId);

        existingJobOrder.jobRoleId = jobRole.id;
        await this.jobOrderService.update(tenantId, jobOrderId, existingJobOrder);
        break;
      default:
        break;
    }
  }

  public async jobSkillDeleted(event: InfoSystemEvent<JobSkillDeletedData>) {
    const {jobId: jobOrderId, masterSkillType, skillCode} = event.parameters;
    const [{id: tenantId}, existingJobOrder] = await this.getEventData(event);

    // find skill that should be updated
    switch (masterSkillType) {
      case SkillType.Language:
        const language = await this.getLanguage(skillCode);

        // check if the received language exists for the order
        const existingLanguageForOrder = await this.jobOrderLanguageService.findOne(tenantId, jobOrderId, language.id);
        if (!existingLanguageForOrder) {
          throw new InfoSystemError.LanguageNotExistsForOrder();
        } else {
          await this.jobOrderLanguageService.delete(existingLanguageForOrder);
        }
        break;
      case SkillType.Certification:
        const certification = await this.getCertification(skillCode, tenantId);

        // check if the received certification exists for the order
        const existingCertificationForOrder = await this.jobOrderCertificationService.findOne(
          tenantId,
          jobOrderId,
          certification.id,
        );
        if (!existingCertificationForOrder) {
          throw new InfoSystemError.CertificationNotExistsForOrder();
        } else {
          await this.jobOrderCertificationService.delete(existingCertificationForOrder);
        }
        break;
      case SkillType.JobRole:
        // check if info send us correct skillCode
        await this.getJobRole(skillCode, tenantId);

        existingJobOrder.jobRoleId = null;
        await this.jobOrderService.update(tenantId, jobOrderId, existingJobOrder);
        break;
      default:
        break;
    }
  }
}
