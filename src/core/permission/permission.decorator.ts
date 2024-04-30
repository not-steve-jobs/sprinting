import {SetMetadata, applyDecorators, UseGuards} from '@nestjs/common';
import {PermissionGuard} from './permission.guard';
import {UserPermission} from './permission.interface';

export const Permission = (requiredPermissions: UserPermission | UserPermission[]) => {
  return applyDecorators(SetMetadata('requiredPermissions', requiredPermissions), UseGuards(PermissionGuard));
};
