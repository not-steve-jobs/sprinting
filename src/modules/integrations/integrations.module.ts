import {Module} from '@nestjs/common';
import {InfoSystemModule} from './infoSystem/infoSystem.module';
import {DataProvidingModule} from './dataProviding/dataProviding.module';
import {SalesForceModule} from './salesForce/salesForce.module';

@Module({
  imports: [InfoSystemModule, DataProvidingModule, SalesForceModule],
  providers: [],
  controllers: [],
  exports: [],
})
export class IntegrationsModule {}
