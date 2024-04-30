import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {ContextService} from './context/context.service';
import {GlobalLogContext} from './context/globalLog.context';
import {AppConfigService} from './config/appConfig.service';

@Injectable()
export class SetGlobalLogContextInterceptor implements NestInterceptor {
  constructor(private readonly contextService: ContextService, private readonly appConfig: AppConfigService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    this.contextService.globalLogContext = new GlobalLogContext(this.appConfig);

    return next.handle();
  }
}
