import {PermissionError} from './permission/permission.error';
import {ArgumentsHost, Catch, ExceptionFilter, Injectable, Scope, HttpStatus} from '@nestjs/common';
import {Response} from 'express';
import {ContextService} from './context/context.service';
import {UtilsHelper} from '../helpers/utils.helper';
import {Logger} from './logger';
import {ErrorBase} from '../lib/appErrorBase/errorBase.interface';

interface ErrorData {
  status: number;
  name: string;
  data: any | undefined;
  stack: string | undefined;
  innerError: Error | undefined;
  errorTraceId?: string | undefined;
  requestTraceId?: string | undefined;
  clientTraceId?: string | undefined;
  tenantId?: number | undefined;
  side: string;
  env: string;
}

@Injectable({scope: Scope.REQUEST})
@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  constructor(
    private readonly contextService: ContextService,
    private readonly utilsHelper: UtilsHelper,
    private readonly logger: Logger,
  ) {}

  private resolveErrorTraceId = (): string | undefined => {
    return this.utilsHelper.traceId('ERR', 8);
  };

  private resolveRequestTraceId = (): string | undefined => {
    return this.contextService?.traceContext?.requestTraceId;
  };

  private resolveClientTraceId = (): string | undefined => {
    return this.contextService?.clientContext?.traceId;
  };

  private resolveTenantId = (): number | undefined => {
    return this.contextService?.tenantContext?.tenantId;
  };

  private resolveStatus = (e: Error | ErrorBase<any>, isUnintended: boolean): number => {
    return isUnintended ? (e as any).status ?? 500 : (e as ErrorBase<any>).getStatus() ?? 500;
  };

  private resolveName = (e: Error | ErrorBase<any>, isUnintended: boolean): string => {
    return isUnintended ? (e as any).name : (e as ErrorBase<any>).getName?.() ?? 'Unknown error';
  };

  private resolveData = (e: Error | ErrorBase<any>, isUnintended: boolean): string => {
    return isUnintended ? (e as any).data ?? undefined : (e as ErrorBase<any>).getData?.() ?? 'Unknown data';
  };

  private resolveStack = (e: Error | ErrorBase<any>, isUnintended: boolean): string => {
    return isUnintended ? e.stack : (e as ErrorBase<any>).getStack?.() ?? 'Unknown stack';
  };

  private resolveInnerError = (e: Error | ErrorBase<any>, isUnintended: boolean): Error => {
    const result = isUnintended
      ? (e as any).innerError
      : (e as ErrorBase<any>).getInnerError?.() ?? 'Unknown internal error';
    if (!result) {
      return result;
    }
    const error = {
      name: result.name,
      message: result.message,
      stack: result.stack,
    };
    return error;
  };

  parseError = (e: Error | ErrorBase<any>, isUnintended: boolean): ErrorData => ({
    status: this.resolveStatus(e, isUnintended),
    name: this.resolveName(e, isUnintended),
    data: this.resolveData(e, isUnintended),
    stack: this.resolveStack(e, isUnintended),
    innerError: this.resolveInnerError(e, isUnintended),
    errorTraceId: this.resolveErrorTraceId(),
    requestTraceId: this.resolveRequestTraceId(),
    clientTraceId: this.resolveClientTraceId(),
    tenantId: this.resolveTenantId(),
    side: 'api',
    env: process.env.NODE_ENV,
  });

  catch(exception: Error | ErrorBase<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const isUnintended = 'getStatus' in exception ? false : true;
    const errorData: ErrorData = this.parseError(exception, isUnintended);

    if (exception?.name === PermissionError.PermissionRequiredGuardError.name) {
      // this was used if we have 'x-permission-check' (used in permission.guard)
      // guard will throw some custom error and only in that case we can force response
      response.status(HttpStatus.OK).send();
      return;
    }

    let errorToLog: any;
    if (isUnintended) {
      errorToLog = {
        name: (exception as Error).name,
        message: (exception as Error).message,
        stack: (exception as Error).stack,
        data: errorData,
      };
    } else {
      if ((exception as ErrorBase<any>)?.setData) {
        (exception as ErrorBase<any>)?.setData(errorData);
      }
    }
    this.logger.errorObject(__filename, errorToLog || exception);

    if (['a-env', 'd-env'].indexOf(process.env.NODE_ENV) !== -1) {
      this.logger.info(__filename, `\nError log: ----> \n ${JSON.stringify(errorData, null, 2)}`);
    }
    // TODO: Filter for prod/dev environments
    response.status(errorData.status).json({
      timestamp: new Date().toISOString(),
      errorTraceId: errorData.errorTraceId,
      requestTraceId: errorData.requestTraceId,
      clientTraceId: errorData.clientTraceId,
      status: errorData.status,
      error: {
        name: errorData.name,
        data: errorData.data,
        stack: errorData.stack,
        innerError: errorData.innerError,
      },
    });
  }
}
