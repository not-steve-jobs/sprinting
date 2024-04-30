import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {WorkTypeRepository} from './workType.repository';
import {WorkTypeService} from './workType.service';
import {WorkTypeController} from './workType.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([WorkTypeRepository])],
  controllers: [WorkTypeController],
  providers: [WorkTypeService],
  exports: [WorkTypeService],
})
export class WorkTypeModule {}
