import {Module} from '@nestjs/common';
import {PersonService} from './person.service';
import {CoreModule} from '../../core/core.module';
import {TenantModule} from '../tenant/tenant.module';
import {CustomHttpModule} from '../customHttp/customHttp.module';

@Module({
  imports: [CustomHttpModule, CoreModule, TenantModule],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
