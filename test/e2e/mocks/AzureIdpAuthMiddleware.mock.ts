import {Request, Response} from 'express';

import {AzureIdpAuthMiddleware} from 'src/core/auth/azureIdpAuth.middleware';
import {testTenant} from '../tenant/data';

/**
 * We don't have a real JWT Token as part of the requests for the BE e2e tests so we mock the global middleware and skip its verification
 *
 * @param {number} tenantId
 */
export const mockAzureIdpAuthMiddleware = (tenantId: number): void => {
  jest.spyOn(AzureIdpAuthMiddleware.prototype, 'use').mockImplementation(
    async (request: Request, res: Response, next: () => void): Promise<void> => {
      request.context.authArtifacts = {
        authType: 'azureIdp',
        userEmail: 'test@mail.com', // TODO: Get those from testUser, for some reason it's failing during the compilation
        B2CId: '12345678-0000-4004-0000-000000000001', // TODO: Get those from testUser, for some reason it's failing during the compilation
        tenantId: tenantId ?? testTenant.id, // TODO: Get those from testTenantUser, for some reason it's failing during the compilation
        userId: null,
      };

      return next();
    },
  );
};
