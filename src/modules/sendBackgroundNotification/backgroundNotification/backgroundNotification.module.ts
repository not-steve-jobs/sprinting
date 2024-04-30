import {forwardRef, Module} from '@nestjs/common';

import {CoreModule} from 'src/core/core.module';
import {TenantModule} from 'src/modules/tenant/tenant.module';
import {CountryModule} from 'src/modules/country/country.module';

import {EmailQueuedModule} from 'src/modules/sendBackgroundNotification/email/emailQueued.module';
import {BackgroundNotificationService} from './backgroundNotification.service';
import {FeatureConfigurationModule} from 'src/modules/featureConfiguration/featureConfiguration.module';
import {UserModule} from 'src/modules/user/user.module';

@Module({
  imports: [
    EmailQueuedModule,
    CoreModule,
    TenantModule,
    CountryModule,
    FeatureConfigurationModule,
    forwardRef(() => UserModule),
  ],
  providers: [BackgroundNotificationService],
  controllers: [],
  exports: [BackgroundNotificationService],
})
export class BackgroundNotificationModule {}
