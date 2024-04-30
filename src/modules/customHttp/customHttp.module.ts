import {Module, HttpModule, HttpService} from '@nestjs/common';
import {AXIOS_INSTANCE_TOKEN} from '@nestjs/common/http/http.constants';
import {Axios} from 'axios';
import {CustomHttpService} from './customHttp.service';

//Always use CustomHttpModule instead of HttpModule
@Module({
  imports: [HttpModule],
  providers: [
    {provide: AXIOS_INSTANCE_TOKEN, useValue: Axios},
    CustomHttpService,
    {provide: HttpService, useClass: CustomHttpService},
  ],
  exports: [CustomHttpService, {provide: AXIOS_INSTANCE_TOKEN, useValue: Axios}],
})
export class CustomHttpModule {}
