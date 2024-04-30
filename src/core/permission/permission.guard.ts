import {AuthRoles} from '../auth/authRoles';
import {CanActivate, ExecutionContext, HttpStatus, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ContextService} from '../context/context.service';
import {PermissionError} from './permission.error';
import {Request} from 'express';
import cacheManager from 'cache-manager';
import {UserPermission} from './permission.interface';
import {PermissionScopes} from './permissionScopes';
import {isArray} from 'lodash';
import {TenantUser} from '../../modules/tenantUser/tenantUser.entity';
import {TenantUserContext} from '../context/tenantUser.context';
import {PermissionAction} from 'src/modules/permission/permission.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  static cache: cacheManager.Cache = cacheManager.caching({store: 'memory', ttl: 0, max: 0});

  constructor(private readonly reflector: Reflector, private readonly contextService: ContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.getArgs()[0] as Request;
    const defaultAction = PermissionAction.Write;
    const tenantUserContext: TenantUserContext = this.contextService.tenantUserContext;
    if (typeof tenantUserContext === 'undefined') throw new PermissionError.PermissionUserContextNotFound();

    const tenantUser: TenantUser = tenantUserContext.tenantUser;
    if (typeof tenantUser === 'undefined') throw new PermissionError.PermissionUserContextInfoNotFound();
    if (typeof tenantUser.tenantId === 'undefined') throw new PermissionError.PermissionTenantIdNotFound();
    if (typeof tenantUser.userId === 'undefined') throw new PermissionError.PermissionUserIdNotFound();

    let requiredPermissions: UserPermission[] = [];
    const _requiredPermissions = this.reflector.get<UserPermission>('requiredPermissions', context.getHandler());
    requiredPermissions = isArray(_requiredPermissions) ? _requiredPermissions : [_requiredPermissions];

    // if a user is an admin don't check anything
    const hasPermission =
      AuthRoles.isAdmin(tenantUser.roleId) ||
      (
        await Promise.all(
          requiredPermissions.map(async (requiredPermission: UserPermission) => {
            const {permName, permAction} = requiredPermission;
            return await this.checkUserPermission(permName, permAction ?? defaultAction, tenantUser);
          }),
        )
      ).reduce((ac: boolean, item: boolean) => ac && item, true);

    if (hasPermission === false) {
      throw new PermissionError.PermissionRequired(request?.url).setStatus(HttpStatus.FORBIDDEN);
    }

    if (typeof request.headers['x-permission-check'] !== 'undefined') {
      throw new PermissionError.PermissionRequiredGuardError();
    }

    return true;
  }

  private async checkUserPermission(permName: string, permAction: string, tenantUser: TenantUser): Promise<boolean> {
    const userPermissions: UserPermission[] = PermissionScopes.getAllUserPermissions(tenantUser.tenantUserPermissions);
    return !!userPermissions.find(
      (permission: UserPermission) => permission.permName === permName && permission.permAction === permAction,
    );
  }
}
