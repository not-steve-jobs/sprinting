import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {ClientProfileRepository} from './clientProfile.repository';
import {ClientProfileController} from './clientProfile.controller';
import {ClientProfileService} from './clientProfile.service';
import {LocationModule} from '../location/location.module';
import {DataProvidingModule} from '../integrations/dataProviding/dataProviding.module';
import {TenantModule} from '../tenant/tenant.module';
import {SalesForceModule} from '../integrations/salesForce/salesForce.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientProfileRepository]),
    CoreModule,
    LocationModule,
    TenantModule,
    SalesForceModule,
    forwardRef(() => DataProvidingModule),
  ],
  controllers: [ClientProfileController],
  providers: [ClientProfileService],
  exports: [TypeOrmModule.forFeature([ClientProfileRepository]), ClientProfileService],
})
export class ClientProfileModule {}
