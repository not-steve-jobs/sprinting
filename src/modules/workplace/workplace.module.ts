import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {WorkplaceRepository} from './workplace.repository';
import {WorkplaceService} from './workplace.service';
import {WorkplaceController} from './workplace.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([WorkplaceRepository])],
  controllers: [WorkplaceController],
  providers: [WorkplaceService],
  exports: [WorkplaceService],
})
export class WorkplaceModule {}
