import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {EmploymentTypeRepository} from './employmentType.repository';
import {EmploymentTypeService} from './employmentType.service';
import {EmploymentTypeController} from './employmentType.controller';
@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([EmploymentTypeRepository])],
  controllers: [EmploymentTypeController],
  providers: [EmploymentTypeService],
})
export class EmploymentTypeModule {}
