import {JobOrderCertificationService} from './jobOrderCertification.service';
import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JobOrderCertificationRepository} from './jobOrderCertification.repository';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([JobOrderCertificationRepository])],
  controllers: [],
  providers: [JobOrderCertificationService],
  exports: [JobOrderCertificationService],
})
export class JobOrderCertificationModule {}
