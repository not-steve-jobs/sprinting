import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {CoreModule} from 'src/core/core.module';
import {JobOrderModule} from 'src/modules/jobOrder/jobOrder.module';

import {EmailNotificationService} from './emailNotification.service';
import {EmailNotificationRepository} from './emailNotification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmailNotificationRepository]), CoreModule, forwardRef(() => JobOrderModule)],
  controllers: [],
  providers: [EmailNotificationService],
  exports: [EmailNotificationService],
})
export class EmailNotificationModule {}
