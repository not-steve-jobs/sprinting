import {Module} from '@nestjs/common';

import {CoreModule} from 'src/core/core.module';
import {GoogleApiService} from './googleApi.service';

@Module({
  imports: [CoreModule],
  controllers: [],
  providers: [GoogleApiService],
  exports: [GoogleApiService],
})
export class GoogleApiModule {}
