import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {CaseCommentRepository} from './caseComment.repository';
import {CaseCommentController} from './caseComment.controller';
import {CaseCommentService} from './caseComment.service';
import {FileModule} from '../file/file.module';
import {InfoSystemModule} from './../integrations/infoSystem/infoSystem.module';
import {NotificationModule} from '../notification/notification.module';
import {CaseModule} from '../case/case.module';
import {CaseFollowerModule} from '../caseFollower/caseFollower.module';
import {TenantRepository} from '../tenant/tenant.repository';
import {UserRepository} from '../user/user.repository';
import {UserProfileRepository} from '../userProfile/userProfile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CaseCommentRepository, TenantRepository, UserRepository, UserProfileRepository]),
    CoreModule,
    forwardRef(() => FileModule),
    NotificationModule,
    forwardRef(() => CaseModule),
    CaseFollowerModule,
    forwardRef(() => InfoSystemModule),
  ],
  controllers: [CaseCommentController],
  providers: [CaseCommentService],
  exports: [CaseCommentService],
})
export class CaseCommentModule {}
