import {Global, Module} from '@nestjs/common';
import {CoreModule} from 'src/core/core.module';
import {NodeCacheModule} from 'src/modules/nodeCache/nodeCache.module';
import {RedisModule} from 'src/modules/redis/redis.module';
import {AvailableWorkersCacheService} from './availableWorkersCache.service';
import {CandidateCacheService} from './candidateCache.service';
import {CaseCategoryCacheService} from './caseCategoryCache.service';
import {CertificationCacheService} from './certificationCache.service';
import {CloseReasonCacheService} from './closeReasonCache.service';
import {DepartmentCacheService} from './departmentCache.service';
import {DepartmentFunctionCacheService} from './departmentFunctionCache.service';
import {EmploymentTypeCacheService} from './employmentTypeCache.service';
import {FeatureConfigurationCacheService} from './featureConfigurationCache.service';
import {JobRoleCacheService} from './jobRoleCache.service';
import {LanguageCacheService} from './languageCache.service';
import {LevelCacheService} from './levelCache.service';
import {PermissionCacheService} from './permissionCache.service';
import {RateCacheService} from './rateCache.service';
import {RoleCacheService} from './roleCache.service';
import {SectorCacheService} from './sectorCache.service';
import {ServiceTypeCacheService} from './serviceTypeCache.service';
import {ShiftCacheService} from './shiftCache.service';
import {StatusCacheService} from './statusCache.service';
import {TenantCacheService} from './tenantCache.service';
import {TenantUserCacheService} from './tenantUserCache.service';
import {TypeCacheService} from './typeCache.service';
import {WorkTypeCacheService} from './workTypeCache.service';
import {JobRoleDescriptionCacheService} from './JobRoleDescriptionCache.service';
import {ConsentCacheService} from './consentCache.service';

@Global()
@Module({
  imports: [RedisModule, NodeCacheModule, CoreModule],
  providers: [
    TenantUserCacheService,
    CandidateCacheService,
    TenantCacheService,
    WorkTypeCacheService,
    TypeCacheService,
    StatusCacheService,
    ShiftCacheService,
    ServiceTypeCacheService,
    SectorCacheService,
    RateCacheService,
    RoleCacheService,
    PermissionCacheService,
    LevelCacheService,
    LanguageCacheService,
    JobRoleCacheService,
    FeatureConfigurationCacheService,
    EmploymentTypeCacheService,
    DepartmentFunctionCacheService,
    DepartmentCacheService,
    CloseReasonCacheService,
    CertificationCacheService,
    CaseCategoryCacheService,
    AvailableWorkersCacheService,
    JobRoleDescriptionCacheService,
    ConsentCacheService,
  ],
  exports: [
    TenantUserCacheService,
    CandidateCacheService,
    TenantCacheService,
    WorkTypeCacheService,
    TypeCacheService,
    StatusCacheService,
    ShiftCacheService,
    ServiceTypeCacheService,
    SectorCacheService,
    RateCacheService,
    RoleCacheService,
    PermissionCacheService,
    LevelCacheService,
    LanguageCacheService,
    JobRoleCacheService,
    FeatureConfigurationCacheService,
    EmploymentTypeCacheService,
    DepartmentFunctionCacheService,
    DepartmentCacheService,
    CloseReasonCacheService,
    CertificationCacheService,
    CaseCategoryCacheService,
    AvailableWorkersCacheService,
    JobRoleDescriptionCacheService,
    ConsentCacheService,
  ],
})
export class AppCacheModule {}
