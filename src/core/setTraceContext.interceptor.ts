import {CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope} from '@nestjs/common';
import {Request} from 'express';
import {Observable} from 'rxjs';
import {ContextService} from './context/context.service';
import {TraceContext} from './context/trace.context';
import {UtilsHelper} from '../helpers/utils.helper';

@Injectable({scope: Scope.REQUEST})
export class SetTraceContextInterceptor implements NestInterceptor {
  constructor(private readonly contextService: ContextService, private readonly utilsHelper: UtilsHelper) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    const clientTraceId = request.headers['x-client-traceid'] as string;
    const traceContext = new TraceContext(this.utilsHelper.generateTrackingId('RT'), clientTraceId);
    traceContext.setHeaders(request.headers);
    traceContext.method = request.method;
    traceContext.fullUrl = `https://${request.hostname}${request.path}`;
    traceContext.path = request.path;

    this.contextService.traceContext = traceContext;

    return next.handle();
  }
}
