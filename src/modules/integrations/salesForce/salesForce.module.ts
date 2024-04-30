import {SalesForceErrorService} from './salesForceError.service';
import {TenantUserPermissionRepository} from 'src/modules/tenantUserPermission/tenantUserPermission.repository';
import {FeatureConfigurationModule} from './../../featureConfiguration/featureConfiguration.module';
import {TenantUserLocationModule} from './../../tenantUserLocation/tenantUserLocation.module';
import {TenantUserInvitationModule} from './../../tenantUserInvitation/tenantUserInvitation.module';
import {SalesForceCommandsService} from './salesForceCommands.service';
import {ClientProfileModule} from './../../clientProfile/clientProfile.module';
import {CommonIntegrationError} from '../commonIntegration.error';
import {CommonIntegrationService} from './../commonIntegration.service';
import {CoreModule} from '../../../core/core.module';
import {BusMessageModule} from 'src/modules/busMessage/busMessage.module';
import {SalesForceEventsService} from './salesForceEvents.service';
import {CustomerEventsService} from './events/customerEvents.service';
import {forwardRef, Module} from '@nestjs/common';
import {TenantModule} from '../../tenant/tenant.module';
import {CountryModule} from '../../country/country.module';
import {ClientModule} from '../../client/client.module';
import {UserEventsService} from './events/userEvents.service';
import {LocationModule} from 'src/modules/location/location.module';
import {UserModule} from 'src/modules/user/user.module';
import {PermissionModule} from 'src/modules/permission/permission.module';
import {GoogleApiModule} from 'src/modules/googleApi/googleApi.module';
import {LocationEventsService} from './events/locationEventsService.service';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {UserCommandsService} from './commands/userCommands.service';
import {CustomerCommandsService} from './commands/customerCommands.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {StatusModule} from 'src/modules/status/status.module';
import {SalesForceOutputService} from './salesForceOutput.service';
import {UserProfileRepository} from 'src/modules/userProfile/userProfile.repository';
import {IntegrationLogs} from '../integrationLogging.service';
import {UserProfileModule} from 'src/modules/userProfile/userProfile.module';
import {TransformationsModule} from 'src/modules/transformations/transformations.module';
import {DataProvidingModule} from '../dataProviding/dataProviding.module';
import {RoleModule} from 'src/modules/role/role.module';
import {JobCommandsService} from './commands/jobCommands.service';
import {JobOrderModule} from 'src/modules/jobOrder/jobOrder.module';
import {WorkTypeRepository} from 'src/modules/workType/workType.repository';
import {ServiceTypeRepository} from 'src/modules/serviceType/serviceType.repository';
import {StatusRepository} from 'src/modules/status/status.repository';
import {JobRoleRepository} from 'src/modules/jobRole/jobRole.repository';
import {DepartmentRepository} from 'src/modules/department/department.repository';
import {JobOrderEventsService} from './events/jobOrderEvents.service';
import {TenantUserLocationRepository} from 'src/modules/tenantUserLocation/tenantUserLocation.repository';
import {JobOrderRepository} from 'src/modules/jobOrder/jobOrder.repository';
import {CloseReasonArgumentsRepository} from 'src/modules/closeReasonArguments/closeReasonArguments.repository';

@Module({
  imports: [
    CoreModule,
    forwardRef(() => TenantModule),
    forwardRef(() => ClientModule),
    forwardRef(() => ClientProfileModule),
    forwardRef(() => LocationModule),
    forwardRef(() => UserModule),
    forwardRef(() => UserProfileModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => RoleModule),
    forwardRef(() => DataProvidingModule),
    forwardRef(() => StatusModule),
    forwardRef(() => FeatureConfigurationModule),
    forwardRef(() => TenantUserInvitationModule),
    forwardRef(() => TenantUserLocationModule),
    forwardRef(() => JobOrderModule),
    TransformationsModule,
    BusMessageModule,
    GoogleApiModule,
    CountryModule,
    TypeOrmModule.forFeature([
      TenantUserPermissionRepository,
      TenantUserLocationRepository,
      UserProfileRepository,
      WorkTypeRepository,
      ServiceTypeRepository,
      StatusRepository,
      JobRoleRepository,
      DepartmentRepository,
      JobOrderRepository,
      CloseReasonArgumentsRepository,
    ]),
  ],
  providers: [
    SalesForceEventsService,
    SalesForceCommandsService,
    SalesForceOutputService,
    SalesForceErrorService,
    CommonIntegrationService,
    CustomerEventsService,
    LocationEventsService,
    AppConfigService,
    UserEventsService,
    CommonIntegrationError,
    UserCommandsService,
    CustomerCommandsService,
    JobCommandsService,
    IntegrationLogs,
    JobOrderEventsService,
  ],
  controllers: [],
  exports: [SalesForceCommandsService],
})
export class SalesForceModule {}
