import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from 'src/core/core.module';
import {CloseReasonService} from './closeReason.service';
import {CloseReasonRepository} from './closeReason.repository';
import {CloseReasonController} from './closeReason.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([CloseReasonRepository])],
  controllers: [CloseReasonController],
  providers: [CloseReasonService],
  exports: [CloseReasonService],
})
export class CloseReasonModule {}
