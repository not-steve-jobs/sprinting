import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Request} from 'express';
import {Observable} from 'rxjs';
import {ContextService} from './context/context.service';
import {UtilsHelper} from '../helpers/utils.helper';
import {ClientContext} from './context/client.context';

@Injectable()
export class SetClientContextInterceptor implements NestInterceptor {
  constructor(private readonly contextService: ContextService, private readonly utilsHelper: UtilsHelper) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    this.contextService.clientContext = new ClientContext(request, this.utilsHelper);

    return next.handle();
  }
}
