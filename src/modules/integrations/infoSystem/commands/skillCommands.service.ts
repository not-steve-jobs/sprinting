import {SkillType} from './../eventModels/skill.enum';
import {Tenant} from '../../../tenant/tenant.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {InfoSystemCommand} from '../infoSystemIntegrationTypes';
import {Injectable} from '@nestjs/common';
import {v4 as uuid} from 'uuid';
import {MessageRecordType} from '../eventModels';
import {SkillData} from '../commandModels/createJobSkillsData';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';

@Injectable()
export class SkillCommandsService {
  constructor(public transformationsService: TransformationsService) {}

  public async getCreateJobSkillsCommand(
    commandName: string,
    tenant: Tenant,
    jobOrder: JobOrder,
  ): Promise<InfoSystemCommand> {
    const {id: jobId, jobOrderLanguage, jobOrderCertification, jobRole} = jobOrder;
    const languageSkills: SkillData[] = [];
    for (const {
      levelId,
      language: {infoSkillCode},
    } of jobOrderLanguage) {
      const payload = {
        parameters: {
          masterSkillType: SkillType.Language,
          skillCode: infoSkillCode,
        },
        keyValues: {
          levelId,
        },
      };

      const transformedPayload = await this.transformationsService.getPayloadWithTransformation(
        EC_Transformations.createJobSkills,
        payload,
        BusMessageTypeEnum.COMMAND,
      );

      languageSkills.push(transformedPayload.parameters);
    }

    const certificationSkills: SkillData[] = jobOrderCertification.map(({certification: {infoSkillCode}}) => {
      return {
        masterSkillType: SkillType.Certification,
        skillCode: infoSkillCode,
      };
    });

    const jobRoleSkill = jobRole
      ? [
          {
            masterSkillType: SkillType.JobRole,
            skillCode: jobRole.infoSkillCode,
          },
        ]
      : [];

    return {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        contactRecordType: MessageRecordType.Client,
        jobId,
        skills: [...languageSkills, ...certificationSkills, ...jobRoleSkill],
      },
    };
  }
}
