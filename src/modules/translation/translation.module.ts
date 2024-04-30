import {Module} from '@nestjs/common';
import {ConsoleModule} from 'nestjs-console';
import {CoreModule} from '../../core/core.module';
import {RateModule} from '../rate/rate.module';
import {RoleModule} from '../role/role.module';
import {SectorModule} from '../sector/sector.module';
import {ServiceTypeModule} from '../serviceType/serviceType.module';
import {DepartmentModule} from './../department/department.module';
import {DepartmentFunctionModule} from './../departmentFunction/departmentFunction.module';
import {JobRoleModule} from './../jobRole/jobRole.module';
import {LevelModule} from './../level/level.module';
import {ShiftModule} from './../shift/shift.module';
import {TenantModule} from './../tenant/tenant.module';
import {TranslationService} from './translation.service';

@Module({
  imports: [
    CoreModule,
    ConsoleModule,
    TenantModule,
    DepartmentModule,
    DepartmentFunctionModule,
    JobRoleModule,
    LevelModule,
    RateModule,
    RoleModule,
    SectorModule,
    ServiceTypeModule,
    ShiftModule,
  ],
  controllers: [],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
