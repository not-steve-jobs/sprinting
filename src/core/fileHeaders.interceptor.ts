import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class FileHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const req = context.switchToHttp().getRequest();
        req.res.header('Content-Type', data.contentType);
        req.res.header('Content-disposition', `attachment;filename=${data.filename}`);
        req.res.header('Content-Length', data.buffer.length);
        req.res.header('Access-Control-Expose-Headers', 'Content-disposition');
        req.res.end(data.buffer);
      }),
    );
  }
}
