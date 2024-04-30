import {StatusModule} from './../status/status.module';
import {StatusRepository} from './../status/status.repository';
import {JobOrderAssociateController} from './jobOrderAssociate.controller';
import {JobOrderAssociateService} from './jobOrderAssociate.service';
import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JobOrderAssociateRepository} from '../jobOrderAssociate/jobOrderAssociate.repository';
import {CoreModule} from '../../core/core.module';
import {BackgroundNotificationModule} from '../sendBackgroundNotification/backgroundNotification/backgroundNotification.module';
import {JobOrderModule} from '../jobOrder/jobOrder.module';
import {TenantRepository} from '../tenant/tenant.repository';
import {InfoSystemModule} from '../integrations/infoSystem/infoSystem.module';
import {JobOrderRepository} from '../jobOrder/jobOrder.repository';
import {SalesForceModule} from '../integrations/salesForce/salesForce.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOrderAssociateRepository, JobOrderRepository, StatusRepository, TenantRepository]),
    CoreModule,
    BackgroundNotificationModule,
    StatusModule,
    JobOrderModule,
    forwardRef(() => InfoSystemModule),
    forwardRef(() => SalesForceModule),
  ],
  controllers: [JobOrderAssociateController],
  providers: [JobOrderAssociateService],
  exports: [JobOrderAssociateService],
})
export class JobOrderAssociateModule {}
