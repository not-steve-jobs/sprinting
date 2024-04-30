import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DepartmentFunctionRepository} from './departmentFunction.repository';
import {DepartmentFunctionController} from './departmentFunction.controller';
import {DepartmentFunctionService} from './departmentFunction.service';
import {FeatureConfigurationModule} from '../featureConfiguration/featureConfiguration.module';

@Module({
  imports: [CoreModule, FeatureConfigurationModule, TypeOrmModule.forFeature([DepartmentFunctionRepository])],
  controllers: [DepartmentFunctionController],
  providers: [DepartmentFunctionService],
  exports: [DepartmentFunctionService],
})
export class DepartmentFunctionModule {}
