import {Module} from '@nestjs/common';
import {CoreModule} from 'src/core/core.module';
import {DisableReasonService} from './disableReason.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DisableReasonRepository} from './disableReason.repository';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([DisableReasonRepository])],
  controllers: [],
  providers: [DisableReasonService],
  exports: [DisableReasonService],
})
export class DisableReasonModule {}
