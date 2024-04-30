import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {CaseRepository} from './case.repository';
import {CaseController} from './case.controller';
import {CaseService} from './case.service';
import {CaseFollowerModule} from '../caseFollower/caseFollower.module';
import {InfoSystemModule} from './../integrations/infoSystem/infoSystem.module';
import {BackgroundNotificationModule} from '../sendBackgroundNotification/backgroundNotification/backgroundNotification.module';
import {StatusModule} from '../status/status.module';
import {UserProfileModule} from '../userProfile/userProfile.module';
import {FileModule} from '../file/file.module';
import {NotificationModule} from '../notification/notification.module';
import {TenantRepository} from '../tenant/tenant.repository';
import {InvoiceRepository} from '../invoice/invoice.repository';
import {JobOrderAssociateCaseModule} from '../jobOrderAssociateCase/jobOrderAssociateCase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CaseRepository, TenantRepository, InvoiceRepository]),
    CoreModule,
    CaseFollowerModule,
    forwardRef(() => InfoSystemModule),
    BackgroundNotificationModule,
    StatusModule,
    forwardRef(() => UserProfileModule),
    FileModule,
    NotificationModule,
    JobOrderAssociateCaseModule,
  ],
  controllers: [CaseController],
  providers: [CaseService],
  exports: [CaseService],
})
export class CaseModule {}
