import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {AuthError} from './auth.error';
import type {Request} from 'express';

@Injectable()
export class AzureIdpAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.getArgs()[0] as Request;
    const authContext = request.context.authentication;
    const authArtifacts = request.context.authArtifacts;

    if (authContext.error) {
      throw authContext.error;
    }

    if (!authArtifacts) {
      throw new AuthError.AuthNotAuthenticatedError();
    }

    const isAzureIdpAuthenticated = authArtifacts.authType === 'azureIdp';

    if (!isAzureIdpAuthenticated) {
      throw new AuthError.AuthNotAuthenticatedWithAzureIdpError().setStatus(403);
    }

    return true;
  }
}
