import {Request, Response} from 'express';

import {AuthenticationContext} from 'src/core/context/authentication.context';
import {InitAuthenticationContextMiddleware} from 'src/core/auth/initAuthenticationContext.middleware';

/**
 * We don't want the Bearer Token to be part of the requests for the BE e2e tests so we mock the global middleware and skip this check
 */
export const mockInitAuthenticationContextMiddleware = (): void => {
  jest
    .spyOn(InitAuthenticationContextMiddleware.prototype, 'use')
    .mockImplementation((request: Request, res: Response, next: () => void) => {
      const ctx = new AuthenticationContext();
      request.context.authentication = ctx;

      return next();
    });
};
