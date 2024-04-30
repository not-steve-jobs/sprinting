import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {JwtHelper} from 'src/helpers/jwt.helper';
import {AuthenticationContext} from '../context/authentication.context';
import {ContextService} from '../context/context.service';
import {AuthError} from './auth.error';

@Injectable()
export class InitAuthenticationContextMiddleware implements NestMiddleware<Request, Response> {
  constructor(private readonly contextService: ContextService) {}

  use(request: Request, res: Response, next: () => void) {
    const ctx = new AuthenticationContext();
    request.context.authentication = ctx;

    const auth = request.headers['authorization'];

    if (!auth || !auth?.startsWith('Bearer ')) {
      ctx.error = new AuthError.AuthHeaderNoBearerError({headerName: 'authorization'});
      return next();
    }

    const token = JwtHelper.stripBearer(auth);

    ctx.token = token;
    ctx.nonVerifiedJwtToken = JwtHelper.decodeCompleteToken(token);

    if (!ctx.nonVerifiedJwtToken) {
      ctx.error = new AuthError.AuthTokenUndecodablePayloadError({
        headerName: 'authorization',
      });
    }

    next();
  }
}
