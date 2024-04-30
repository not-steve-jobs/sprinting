import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {TenantContext} from './context/tenant.context';
import type {Request} from 'express';

export const TenantId = createParamDecorator<any, any, number>((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  const tenantContext = request.context.tenantContext as TenantContext;
  return tenantContext.tenantId;
});
