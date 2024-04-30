import {forwardRef, Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DepartmentService} from './department.service';
import {DepartmentController} from './department.controller';
import {DepartmentRepository} from './department.repository';
import {InfoSystemModule} from '../integrations/infoSystem/infoSystem.module';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([DepartmentRepository]), forwardRef(() => InfoSystemModule)],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
