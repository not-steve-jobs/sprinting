import {IntegrationLogs} from './../integrationLogging.service';
import {SkillCommandsService} from './commands/skillCommands.service';
import {JobOrderCommandsService} from './commands/jobOrderCommands.service';
import {ServiceBusClient} from '@azure/service-bus';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {AppConfigService} from '../../../core/config/appConfig.service';
import {
  InfoSystemApplicationProperties,
  InfoSystemCommandObject,
  InfoSystemCommands,
  InfoSystemCommandWithParameters,
} from './infoSystemIntegrationTypes';
import {User} from '../../user/user.entity';
import {UserProfile} from '../../userProfile/userProfile.entity';
import {Case} from './../../case/case.entity';
import {CaseComment} from '../../caseComment/caseComment.entity';
import {File} from '../../file/file.entity';
import {TenantUser} from '../../tenantUser/tenantUser.entity';
import {Tenant} from '../../tenant/tenant.entity';
import {JobOrder} from '../../jobOrder/jobOrder.entity';
import {CaseCommandsService} from './commands/caseCommands.service';
import {UserCommandsService} from './commands/userCommands.service';
import {FileCommandsService} from './commands/fileCommands.service';
import {CommonIntegrationService} from '../commonIntegration.service';
import {JobOrderAssociate} from '../../jobOrderAssociate/jobOrderAssociate.entity';
import {CustomAppProperties, DestinationSystem} from '../../tenant/tenant.enum';
import {BusMessageScopeEnum} from 'src/modules/busMessage/busMessage.enum';
import {IntegrationSystemLogType} from '../integrationSystem.enum';

@Injectable()
export class InfoSystemCommandsService {
  constructor(
    private readonly appConfigService: AppConfigService,
    @Inject(forwardRef(() => JobOrderCommandsService))
    private readonly jobOrderCommandsService: JobOrderCommandsService,
    private readonly skillCommandsService: SkillCommandsService,
    private readonly caseCommandsService: CaseCommandsService,
    private readonly userCommandsService: UserCommandsService,
    private readonly fileCommandsService: FileCommandsService,
    private readonly commonIntegrationService: CommonIntegrationService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async sendContactCreated(
    tenant: Tenant,
    user: User,
    userProfile: UserProfile,
    invitedByUserId: string = null,
  ) {
    this.execute(
      await this.userCommandsService.getContactCommand(
        InfoSystemCommands.createContact,
        tenant,
        user,
        userProfile,
        invitedByUserId,
      ),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.createContact),
    );
  }

  public async sendContactUpdated(tenant: Tenant, user: User, userProfile: UserProfile) {
    this.execute(
      await this.userCommandsService.getContactCommand(InfoSystemCommands.updateContact, tenant, user, userProfile),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.updateContact),
    );
  }

  public async sendPortalAccessCreated(
    user: User,
    userLocations: string[],
    userPermissions: string[],
    tenantUser?: TenantUser,
    tenant?: Tenant,
  ) {
    this.execute(
      this.userCommandsService.getCreatePortalAccessCommand(
        InfoSystemCommands.createPortalAccess,
        user,
        userLocations,
        userPermissions,
        tenantUser || null,
        tenant || null,
      ),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.createPortalAccess),
    );
  }

  public async sendPortalAccessUpdated(
    user: User,
    userLocations: string[],
    userPermissions: string[],
    tenantUser?: TenantUser,
    tenant?: Tenant,
  ) {
    this.execute(
      this.userCommandsService.getUpdatePortalAccessCommand(
        InfoSystemCommands.updatePortalAccess,
        user,
        userLocations,
        userPermissions,
        tenantUser || null,
        tenant || null,
      ),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.updatePortalAccess),
    );
  }

  public async sendCaseCreated(tenant: Tenant, caseEntity: Case) {
    return this.execute(
      await this.caseCommandsService.getCaseCreateCommand(InfoSystemCommands.createClientCase, tenant, caseEntity),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.createClientCase),
    );
  }

  public async sendCaseUpdated(tenant: Tenant, caseEntity: Case) {
    return this.execute(
      await this.caseCommandsService.getCaseUpdateCommand(InfoSystemCommands.updateClientCase, tenant, caseEntity),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.updateClientCase),
    );
  }

  public sendCaseCommentCreated(tenant: Tenant, user: User, userProfile: UserProfile, caseCommentEntity: CaseComment) {
    return this.execute(
      this.caseCommandsService.getCreateCaseCommentCommand(
        InfoSystemCommands.createClientCaseComment,
        tenant,
        user,
        userProfile,
        caseCommentEntity,
      ),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.createClientCaseComment),
    );
  }

  public sendCaseCommentUpdated(tenant: Tenant, user: User, userProfile: UserProfile, caseCommentEntity: CaseComment) {
    return this.execute(
      this.caseCommandsService.getCreateCaseCommentCommand(
        InfoSystemCommands.updateCaseComment,
        tenant,
        user,
        userProfile,
        caseCommentEntity,
      ),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.updateCaseComment),
    );
  }

  public async sendDocumentCreated(tenant: Tenant, fileEntity: File) {
    return this.execute(
      await this.fileCommandsService.getFileCommand(InfoSystemCommands.createDocument, tenant, fileEntity),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.createDocument),
    );
  }

  public async sendJobCreated(tenant: Tenant, jobOrderEntity: JobOrder) {
    return this.execute(
      await this.jobOrderCommandsService.getCreateJobCommand(InfoSystemCommands.createJob, tenant, jobOrderEntity),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.createJob),
    );
  }

  public async sendJobProcessUpdated(tenant: Tenant, jobOrderAssociate: JobOrderAssociate) {
    return this.execute(
      await this.jobOrderCommandsService.getUpdateJobProcessCommand(
        InfoSystemCommands.updateJobProcess,
        tenant,
        jobOrderAssociate,
      ),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.updateJobProcess),
    );
  }

  public async sendSkillsCreated(tenant: Tenant, jobOrderEntity: JobOrder) {
    return this.execute(
      await this.skillCommandsService.getCreateJobSkillsCommand(
        InfoSystemCommands.createJobSkills,
        tenant,
        jobOrderEntity,
      ),
      this.prepareApplicationProperties(tenant, InfoSystemCommands.createJobSkills),
    );
  }

  private isDestinationSystemValid(destinationSystem: DestinationSystem): boolean {
    return [DestinationSystem.INFOCORE, DestinationSystem.INFOEUROPE].includes(destinationSystem);
  }

  private getDestinationSystem(tenant: Tenant): DestinationSystem {
    let destinationSystem: DestinationSystem = DestinationSystem.NONE;
    // check if tenant has destination system from this file and only in that case allow command sending
    if (this.isDestinationSystemValid(tenant.destinationSystem)) {
      destinationSystem = tenant.destinationSystem;
    }
    return destinationSystem;
  }

  private prepareApplicationProperties(tenant: Tenant, commandName: InfoSystemCommands) {
    const customDestinationSystem: CustomAppProperties = this.handleCustomDestinationSystem(tenant, commandName);
    if (customDestinationSystem) {
      return {
        CommandName: commandName,
        DestinationSystem: customDestinationSystem.destinationSystem,
      };
    }

    return {
      CommandName: commandName,
      DestinationSystem: this.getDestinationSystem(tenant),
    };
  }

  private handleCustomDestinationSystem(tenant: Tenant, commandName: InfoSystemCommands): CustomAppProperties | null {
    if (tenant.customAppProperties) {
      return tenant.customAppProperties.find(
        (cap) => commandName === cap.commandName && this.isDestinationSystemValid(cap.destinationSystem),
      );
    }
    return null;
  }

  public async execute(
    commandPayload: InfoSystemCommandWithParameters,
    applicationProperties: InfoSystemApplicationProperties,
    busMessageId: string = null,
    fixedBy: string = null,
  ) {
    const {commandsEnabled} = this.appConfigService.infoSystemIntegration;

    if (!commandsEnabled) {
      return;
    }

    // prevent command sending if destination system is missing
    if (applicationProperties.DestinationSystem === DestinationSystem.NONE) {
      this.integrationLogs.missingDestinationSystem(__filename, IntegrationSystemLogType.InfoSystemIntegration, {
        commandName: commandPayload.commandName,
        brand: commandPayload.brand,
        country: commandPayload.country,
      });
      return;
    }
    const connectionString = this.appConfigService.infoSystemIntegration.commandsConnectionString;

    const sendObject: InfoSystemCommandObject = {
      applicationProperties: applicationProperties,
      body: commandPayload,
    };

    const commandsTopic = this.appConfigService.infoSystemIntegration.commandsTopic;
    this.integrationLogs.logCommand(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      commandsTopic,
      sendObject,
    );
    const serviceBusClient = new ServiceBusClient(connectionString);
    const sender = serviceBusClient.createSender(commandsTopic);

    try {
      await sender.sendMessages(sendObject);
      if (busMessageId) {
        await this.commonIntegrationService.saveCommandAttempt(busMessageId, fixedBy);
      } else {
        await this.commonIntegrationService.saveCommand(sendObject, BusMessageScopeEnum.INFO);
      }
    } catch (e) {
      this.integrationLogs.sendCommandMessageError(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
        commandsTopic,
        e,
      );
    }
  }
}
