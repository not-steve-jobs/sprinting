import {IntegrationLogs} from './../../integrationLogging.service';
import {Injectable} from '@nestjs/common';
import {ClientCaseCommentCreatedData, ClientCaseUpdatedData, InfoSystemEvent} from '../eventModels';
import {TenantService} from '../../../tenant/tenant.service';
import {UpdateCaseDto} from '../../../case/dto/updateCase.dto';
import {CaseService} from '../../../case/case.service';
import {CaseCommentService} from '../../../caseComment/caseComment.service';
import {CreateCaseCommentDto} from '../../../caseComment/dto/createCaseComment.dto';
import {CaseUpdateOrigin} from 'src/modules/case/case.constants';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {CommonIntegrationError} from '../../commonIntegration.error';
import {IntegrationSystemLogType} from '../../integrationSystem.enum';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';

@Injectable()
export class CaseEventsService {
  public constructor(
    private readonly tenantService: TenantService,
    private readonly caseService: CaseService,
    private readonly caseCommentService: CaseCommentService,
    private readonly transformationsService: TransformationsService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async onClientCaseUpdated(event: InfoSystemEvent<ClientCaseUpdatedData>) {
    this.integrationLogs.logMessageHandler(__filename, IntegrationSystemLogType.InfoSystemIntegration, 'Case Updated');

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    event.keyValues = {
      tenantId: tenant.id,
      status: event.parameters.status,
    };

    const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.clientCaseUpdated,
      event,
      BusMessageTypeEnum.EVENT,
    );

    const updatedCase: UpdateCaseDto = {
      statusId: transformedEvent.parameters.statusId,
    };

    await this.caseService.updateCase(tenant.id, event.parameters.caseId, updatedCase, CaseUpdateOrigin.INFO);
  }

  public async onClientCaseCommentCreated(event: InfoSystemEvent<ClientCaseCommentCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Case Comment Created',
    );

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    let userName = null;
    let commentBody = event.parameters.commentBody;
    if (event.parameters.commentBody) {
      const delimIndex = commentBody.indexOf(':');
      if (delimIndex != -1) {
        userName = commentBody.substring(0, delimIndex).trim();
        commentBody = commentBody.substring(delimIndex + 1, commentBody.length);
      }
    }

    const caseCommentData: CreateCaseCommentDto = {
      caseId: event.parameters.caseId,
      value: commentBody,
      userName: userName,
    };

    await this.caseCommentService.create(tenant.id, caseCommentData, null);
  }
}
