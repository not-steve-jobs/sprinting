import {FeatureConfigurationModule} from './../featureConfiguration/featureConfiguration.module';
import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {FileRepository} from './file.repository';
import {FileController} from './file.controller';
import {FileService} from './file.service';
import {AzureStorageHelper} from '../../helpers/azure.storage.helper';
import {InfoSystemModule} from './../integrations/infoSystem/infoSystem.module';
import {TenantRepository} from '../tenant/tenant.repository';
import {TenantModule} from '../tenant/tenant.module';
import {PersonModule} from '../person/person.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileRepository, TenantRepository]),
    CoreModule,
    FeatureConfigurationModule,
    forwardRef(() => InfoSystemModule),
    forwardRef(() => TenantModule),
    forwardRef(() => PersonModule),
  ],
  controllers: [FileController],
  providers: [FileService, AzureStorageHelper],
  exports: [FileService],
})
export class FileModule {}
