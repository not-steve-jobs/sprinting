import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JobRoleTemplateRepository} from './jobRoleTemplate.repository';
import {JobRoleTemplateService} from './jobRoleTemplate.service';
import {CoreModule} from 'src/core/core.module';
import {LanguageModule} from '../language/language.module';
import {UserProfileModule} from '../userProfile/userProfile.module';
import {JobRoleModule} from '../jobRole/jobRole.module';
import {TenantModule} from '../tenant/tenant.module';
import {CountryModule} from '../country/country.module';
import {CustomHttpModule} from '../customHttp/customHttp.module';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([JobRoleTemplateRepository]),
    forwardRef(() => LanguageModule),
    forwardRef(() => UserProfileModule),
    forwardRef(() => JobRoleModule),
    TenantModule,
    CountryModule,
    CustomHttpModule,
  ],
  providers: [JobRoleTemplateService],
  exports: [JobRoleTemplateService],
})
export class JobRoleTemplateModule {}
