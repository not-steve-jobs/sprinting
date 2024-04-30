import {Module} from '@nestjs/common';
import {CoreModule} from 'src/core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TenantUserRepository} from './tenantUser.repository';

// TODO: This module is virtually unused because the repository is imported again in UserModule
//       There should be a TenantUserService to use as an interface for TenantUserRepository
//       Otherwise, tenantUserRepository should be part of the UserModule, because that is the only place where this is used

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([TenantUserRepository])],
  providers: [],
  controllers: [],
  exports: [],
})
export class TenantUserModule {}
