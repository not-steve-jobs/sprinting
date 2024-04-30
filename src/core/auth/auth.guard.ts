import {LocationRepository} from './../../modules/location/location.repository';
import {AuthRoles} from './authRoles';
import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ContextService} from '../context/context.service';
import {TenantUserRepository} from '../../modules/tenantUser/tenantUser.repository';
import {AuthError} from './auth.error';
import {AuthHelper} from '../../helpers/auth.helper';
import {UserContext} from '../context/user.context';
import type {Request} from 'express';
import {TenantUserContext} from '../context/tenantUser.context';
import {AuthScopes} from './authScopes';
import {TenantUserCacheService} from 'src/appCache/tenantUserCache.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly locationRepository: LocationRepository,
    private readonly authHelper: AuthHelper,
    private readonly tenantUserCache: TenantUserCacheService,
  ) {}

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

    const {B2CId, tenantId} = authArtifacts;

    // Try to find the tenantUser in the cache
    let tenantUser = await this.tenantUserCache.get(tenantId, B2CId);

    if (!tenantUser) {
      // If not cached, fetch the tenantUser (expensive operation if it exists)
      tenantUser = await this.tenantUserRepository.getAuthUserData(tenantId, B2CId);

      if (!tenantUser) {
        throw new AuthError.AuthTokenUserMissingError({
          tenantId,
          userId: B2CId,
        });
      }

      if (request.params.tenantId) {
        if (tenantUser.tenantId != Number(request.params.tenantId)) {
          throw new AuthError.AuthTokenUserMissingError({
            tenantId,
            userId: tenantUser.userId,
          });
        }
      }

      tenantUser.tenantUserLocations = (AuthRoles.isAdmin(tenantUser.roleId)
        ? await this.locationRepository.fetchLocationsForClient(tenantUser.user.clientId, true)
        : tenantUser.tenantUserLocations.map(({location}) => location)
      ).map((tenantUserLocation) => ({...tenantUserLocation, locationId: tenantUserLocation.id}));

      await this.tenantUserCache.set(tenantUser);
    }

    // Set the user and the tenantUser to the context
    this.contextService.userContext = new UserContext(tenantUser.user);

    this.contextService.tenantUserContext = new TenantUserContext(tenantUser);

    const requiredScopes = this.reflector.get<string[]>('scopes', context.getHandler()) || [];
    let userScopes: string[] = [];

    if (tenantUser) {
      // available user scopes (roles)
      userScopes = await this.authHelper.getScopesForUser(tenantUser);
    }

    // don't check anything if a user is an admin
    if (AuthRoles.isAdmin(tenantUser.roleId)) {
      return true;
    }

    if (requiredScopes.includes(AuthScopes.self)) {
      if (request.params.userId == tenantUser.userId) {
        return true;
      }
    }

    const inRoleScope = !!requiredScopes.find((scope) =>
      userScopes.filter((i) => i.indexOf('role-') === 0).includes(scope),
    );

    if (!inRoleScope) {
      throw new AuthError.AuthUserDoesNotHaveRequiredScopesError().setStatus(403);
    }

    // if everything is valid go to controller
    return true;
  }
}
