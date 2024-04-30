import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Request} from 'express';
import {Observable} from 'rxjs';
import {ContextService} from './context/context.service';
import {Logger} from './logger';

@Injectable()
export class LogRequestStartInterceptor implements NestInterceptor {
  constructor(private readonly contextService: ContextService, private readonly logger: Logger) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    const rctx = this.contextService.clientContext;

    // TODO: Add app config to disable certain paths, methods
    let message = `APICALL BEFORE ${request.method} ${request.path}\n`;
    message += `(${rctx.platform} ${rctx.platformVersion} api ${rctx.apiVersion})`;
    if (rctx.brand) {
      message += ` ${rctx.brand}`;
    }

    // TODO: Do we need this??
    // if (rctx.clientMobileModel) {
    //   message += ` ${rctx.clientMobileModel}`;
    // }

    message += ` ${rctx.traceId}`;
    this.logger.debug(__filename, message);

    return next.handle();
  }
}
