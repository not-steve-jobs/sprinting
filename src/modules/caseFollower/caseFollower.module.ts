import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {CaseFollowerRepository} from './caseFollower.repository';
import {CaseFollowerService} from './caseFollower.service';
import {NotificationModule} from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([CaseFollowerRepository]), CoreModule, NotificationModule],
  controllers: [],
  providers: [CaseFollowerService],
  exports: [CaseFollowerService],
})
export class CaseFollowerModule {}
