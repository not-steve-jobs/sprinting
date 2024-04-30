import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JobRoleRepository} from './jobRole.repository';
import {JobRoleService} from './jobRole.service';
import {JobRoleController} from './jobRole.controller';
import {CoreModule} from 'src/core/core.module';
import {AzureCognitiveSearchModule} from '../azureCognitiveSearch/azureCognitiveSearch.module';
import {JobRoleTemplateModule} from '../jobRoleTemplate/jobRoleTemplate.module';
import {FeatureConfigurationModule} from '../featureConfiguration/featureConfiguration.module';

@Module({
  imports: [
    CoreModule, // required for auth decorator
    TypeOrmModule.forFeature([JobRoleRepository]),
    forwardRef(() => JobRoleTemplateModule),
    AzureCognitiveSearchModule,
    FeatureConfigurationModule,
  ],
  providers: [JobRoleService],
  controllers: [JobRoleController],
  exports: [JobRoleService],
})
export class JobRoleModule {}
