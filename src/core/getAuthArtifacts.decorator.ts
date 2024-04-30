import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import type {Request} from 'express';
import {AuthArtifacts} from './auth/authArtifacts.interface';

export const GetAuthArtifacts = createParamDecorator<any, any, AuthArtifacts>((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  return request.context.authArtifacts;
});
