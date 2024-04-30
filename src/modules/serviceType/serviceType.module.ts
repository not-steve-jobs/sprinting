import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ServiceTypeRepository} from './serviceType.repository';
import {ServiceTypeService} from './serviceType.service';
import {ServiceTypeController} from './serviceType.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([ServiceTypeRepository])],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
  exports: [ServiceTypeService],
})
export class ServiceTypeModule {}
