import {MessageRecordType} from './../eventModels/messageRecordType';
import {Tenant} from './../../../tenant/tenant.entity';
import {InfoSystemCommand} from './../infoSystemIntegrationTypes';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import * as dateFns from 'date-fns';
import {v4 as uuid} from 'uuid';
import {Case} from '../../../case/case.entity';
import {CaseCategoryType} from '../../../caseCategory/caseCategory.entity';
import {LocationDto} from '../../../location/dto/location.dto';
import {User} from '../../../user/user.entity';
import {CaseComment} from '../../../caseComment/caseComment.entity';
import {UserProfile} from 'src/modules/userProfile/userProfile.entity';
import {JobOrderAssociateCaseService} from 'src/modules/jobOrderAssociateCase/jobOrderAssociateCase.service';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {BusMessage} from '../../../busMessage/busMessage.entity';
import {TenantService} from 'src/modules/tenant/tenant.service';
import {CommonIntegrationError} from '../../commonIntegration.error';
import {InfoSystemError} from '../infoSystem.error';
import {FileRepository} from 'src/modules/file/file.repository';
import {InfoSystemCommandsService} from '../infoSystemCommands.service';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';

@Injectable()
export class CaseCommandsService {
  public constructor(
    private readonly jobOrderAssociateCaseService: JobOrderAssociateCaseService,
    private readonly transformationsService: TransformationsService,
    private readonly tenantService: TenantService,
    private readonly fileRepository: FileRepository,
    @Inject(forwardRef(() => InfoSystemCommandsService))
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
  ) {}
  public async getCaseCreateCommand(commandName: string, tenant: Tenant, caseEntity: Case): Promise<InfoSystemCommand> {
    const caseCategoriesWithEntityId = [
      CaseCategoryType.staffingRequests,
      CaseCategoryType.candidatesAssociates,
      CaseCategoryType.mainLocationUpdate,
      CaseCategoryType.roleChange,
      CaseCategoryType.requestCV,
      CaseCategoryType.interviewRequest,
    ];

    const {id, entityId, createdAt, locationId, subject, description, caseCategoryId} = caseEntity;
    let additionalParameters: Record<string, string> | undefined;

    switch (caseCategoryId) {
      case CaseCategoryType.invoices:
        additionalParameters = {invoiceNumber: entityId};
        break;
      case CaseCategoryType.contracts:
        additionalParameters = {contractNumber: entityId};
        break;
      case CaseCategoryType.candidatesAssociates:
      case CaseCategoryType.requestCV:
      case CaseCategoryType.interviewRequest:
        const jobOrderAssociateCase = await this.jobOrderAssociateCaseService.findOneByUserAndCase(
          tenant.id,
          entityId,
          caseEntity.id,
        );
        additionalParameters = {
          jobOrderId: jobOrderAssociateCase ? jobOrderAssociateCase.jobOrderId : null,
        };
        break;
      case CaseCategoryType.staffingRequests:
        additionalParameters = {
          jobOrderId: entityId,
        };
        break;
      case CaseCategoryType.mainLocationUpdate:
        let location: LocationDto;
        try {
          location = caseEntity.location;
        } catch {
          // it shouldn't happen. But crashing is not an option
        }
        additionalParameters = {newLocationName: location?.locationName};
        break;
    }

    const payload = {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        contactRecordType: MessageRecordType.Client,
        additionalParameters,
        subject,
        description,
        locationId,
        entityId: caseCategoriesWithEntityId.includes(caseCategoryId) ? entityId : null,
        caseId: id,
        createdBy: caseEntity.userId,
        createdAt: dateFns.format(createdAt, 'yyyy-MM-dd'),
      },
      keyValues: {
        category: caseCategoryId,
      },
    };

    return this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.createClientCase,
      payload,
      BusMessageTypeEnum.COMMAND,
    );
  }

  public async getCaseUpdateCommand(commandName: string, tenant: Tenant, caseEntity: Case): Promise<InfoSystemCommand> {
    const payload = {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        contactRecordType: MessageRecordType.Client,
        id: caseEntity.id,
      },
      keyValues: {
        statusId: caseEntity.statusId,
      },
    };

    return this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.updateClientCase,
      payload,
      BusMessageTypeEnum.COMMAND,
    );
  }

  public getCreateCaseCommentCommand(
    commandName: string,
    tenant: Tenant,
    user: User,
    userProfile: UserProfile,
    caseCommentEntity: CaseComment,
  ): InfoSystemCommand {
    return {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        contactRecordType: MessageRecordType.Client,
        caseId: caseCommentEntity.caseId,
        clientContactName: userProfile ? `${userProfile.firstName} ${userProfile.firstName}` : user.email,
        commentBody: caseCommentEntity.value,
      },
    };
  }

  public async onCreateCaseSuccess(busMessage: BusMessage) {
    try {
      const {
        body: {
          brand,
          country,
          parameters: {caseId: caseId},
        },
      } = busMessage.payload;
      // find tenant
      const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
      if (!tenant) {
        throw new CommonIntegrationError.CountryBrandNotFound();
      }

      const files = await this.fileRepository.findByCaseId(tenant.id, caseId);
      const fileIntegrationCommandsPromises = files[0].map((entity) =>
        this.infoSystemCommandsService.sendDocumentCreated(tenant, entity),
      );
      await Promise.all(fileIntegrationCommandsPromises);
    } catch (error) {
      throw new InfoSystemError.InfoSystemInvalidDataError({
        message: ' Chained command (CaseCreated) -> sendDocumentCreated error',
      });
    }
  }
}
