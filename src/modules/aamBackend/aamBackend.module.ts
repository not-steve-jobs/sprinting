import {AamBackendService} from './aamBackend.service';
import {Module} from '@nestjs/common';
import {AppConfigService} from '../../core/config/appConfig.service';
import {CoreModule} from '../../core/core.module';
import {CustomHttpModule} from '../customHttp/customHttp.module';

@Module({
  imports: [CustomHttpModule, CoreModule],
  providers: [AppConfigService, AamBackendService],
  exports: [AamBackendService],
})
export class AamBackendModule {}
