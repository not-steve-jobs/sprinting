import {IntegrationLogs} from './../integrationLogging.service';
import {WorkplaceModule} from './../../workplace/workplace.module';
import {ProcessFoCoreBranchCreatedService} from './fixes/processFoCoreBranchCreatedEvents.service';
import {CloseReasonArgumentsModule} from './../../closeReasonArguments/closeReasonArguments.module';
import {CommonIntegrationService} from './../commonIntegration.service';
import {LanguageModule} from './../../language/language.module';
import {CertificationModule} from './../../certification/certification.module';
import {JobOrderCertificationModule} from './../../jobOrderCertification/jobOrderCertification.module';
import {JobRoleModule} from './../../jobRole/jobRole.module';
import {JobOrderLanguageModule} from './../../jobOrderLanguage/jobOrderLanguage.module';
import {SkillCommandsService} from './commands/skillCommands.service';
import {SkilsEventsService} from './events/skilsEvents.service';
import {JobOrderCommandsService} from './commands/jobOrderCommands.service';
import {CloseReasonModule} from './../../closeReason/closeReason.module';
import {forwardRef, Module} from '@nestjs/common';
import {CaseCommentModule} from 'src/modules/caseComment/caseComment.module';
import {CaseModule} from './../../case/case.module';
import {CoreModule} from '../../../core/core.module';
import {CountryModule} from './../../country/country.module';
import {TenantModule} from './../../tenant/tenant.module';
import {InfoSystemCommandsService} from './infoSystemCommands.service';
import {InfoSystemEventsService} from './infoSystemEvents.service';
import {ClientModule} from './../../client/client.module';
import {ClientProfileModule} from './../../clientProfile/clientProfile.module';
import {UserModule} from './../../user/user.module';
import {LocationModule} from './../../location/location.module';
import {JobOrderModule} from './../../jobOrder/jobOrder.module';
import {InfoSystemOutputService} from './infoSystemOutput.service';
import {InfoSystemErrorService} from './infoSystemError.service';
import {TenantUserInvitationModule} from './../../tenantUserInvitation/tenantUserInvitation.module';
import {JobOrderAssociateModule} from '../../jobOrderAssociate/jobOrderAssociate.module';
import {StatusModule} from '../../status/status.module';
import {BranchModule} from 'src/modules/branch/branch.module';
import {LocationBranchModule} from 'src/modules/locationBranch/locationBranch.module';
import {BusMessageModule} from 'src/modules/busMessage/busMessage.module';
import {DataProvidingModule} from '../dataProviding/dataProviding.module';
import {FileModule} from 'src/modules/file/file.module';
import {JobOrderEventsService} from './events/jobOrderEvents.service';
import {LocationEventsService} from './events/locationEvents.service';
import {UserEventsService} from './events/userEvents.service';
import {CaseEventsService} from './events/caseEvents.service';
import {BranchEventsService} from './events/branchEvents.service';
import {FileEventsService} from './events/fileEvents.service';
import {CaseCommandsService} from './commands/caseCommands.service';
import {UserCommandsService} from './commands/userCommands.service';
import {FileCommandsService} from './commands/fileCommands.service';
import {ProcessEventFixesService} from './fixes/processEventFixes.service';
import {ProcessCommandFixesService} from './fixes/processCommandFixes.service';
import {BackgroundNotificationModule} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotification.module';
import {JobOrderAssociateCaseModule} from 'src/modules/jobOrderAssociateCase/jobOrderAssociateCase.module';
import {GoogleApiModule} from 'src/modules/googleApi/googleApi.module';
import {NotificationModule} from 'src/modules/notification/notification.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CaseCommentRepository} from 'src/modules/caseComment/caseComment.repository';
import {RoleModule} from 'src/modules/role/role.module';
import {TransformationsModule} from 'src/modules/transformations/transformations.module';
import {TenantUserRepository} from 'src/modules/tenantUser/tenantUser.repository';
import {UserProfileRepository} from 'src/modules/userProfile/userProfile.repository';
import {FileRepository} from 'src/modules/file/file.repository';
import {DataMigrationEventsService} from '../dataMigration/dataMigration.service';

@Module({
  imports: [
    CoreModule, // required for auth decorator
    forwardRef(() => ClientModule),
    forwardRef(() => ClientProfileModule),
    forwardRef(() => CaseCommentModule),
    forwardRef(() => CaseModule),
    forwardRef(() => UserModule),
    forwardRef(() => LocationModule),
    forwardRef(() => TenantUserInvitationModule),
    forwardRef(() => BranchModule),
    forwardRef(() => LocationBranchModule),
    forwardRef(() => JobOrderModule),
    forwardRef(() => CloseReasonModule),
    forwardRef(() => DataProvidingModule),
    forwardRef(() => JobOrderLanguageModule),
    forwardRef(() => JobOrderCertificationModule),
    forwardRef(() => CertificationModule),
    forwardRef(() => JobOrderAssociateModule),
    forwardRef(() => LanguageModule),
    forwardRef(() => JobRoleModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => FileModule),
    forwardRef(() => TenantModule),
    forwardRef(() => JobOrderAssociateCaseModule),
    forwardRef(() => CloseReasonArgumentsModule),
    CountryModule,
    JobOrderAssociateModule,
    StatusModule,
    BusMessageModule,
    BackgroundNotificationModule,
    GoogleApiModule,
    WorkplaceModule,
    RoleModule,
    TransformationsModule,
    TypeOrmModule.forFeature([CaseCommentRepository, TenantUserRepository, UserProfileRepository, FileRepository]),
  ],
  providers: [
    InfoSystemEventsService,
    InfoSystemCommandsService,
    InfoSystemOutputService,
    InfoSystemErrorService,
    JobOrderEventsService,
    JobOrderCommandsService,
    SkilsEventsService,
    SkillCommandsService,
    CommonIntegrationService,
    LocationEventsService,
    UserEventsService,
    CaseEventsService,
    BranchEventsService,
    FileEventsService,
    CaseCommandsService,
    UserCommandsService,
    FileCommandsService,
    ProcessEventFixesService,
    ProcessCommandFixesService,
    ProcessFoCoreBranchCreatedService,
    DataMigrationEventsService,
    IntegrationLogs,
  ],
  controllers: [],
  exports: [InfoSystemCommandsService],
})
export class InfoSystemModule {}
