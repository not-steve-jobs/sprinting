import {Injectable, Inject, Scope} from '@nestjs/common';
import {TenantContext} from './tenant.context';
import {UserContext} from './user.context';
import {REQUEST} from '@nestjs/core';
import {GlobalLogContext} from './globalLog.context';
import {TraceContext} from './trace.context';
import {ClientContext} from './client.context';
import {AuthArtifacts} from '../auth/authArtifacts.interface';
import {AuthenticationContext} from './authentication.context';
import {TenantUserContext} from './tenantUser.context';

/**
 * Manages information related to the request context.
 *
 * **Important! Inject only in controllers.** Injecting in a service may prevent procedures not started from an HTTP request (such as CRON jobs) to fail at runtime.
 * Reference: https://docs.nestjs.com/fundamentals/injection-scopes#scope-hierarchy
 */
@Injectable({scope: Scope.REQUEST})
export class ContextService {
  constructor(@Inject(REQUEST) private request) {
    if (!this.request) return;

    if (!this.request.context) {
      this.request.context = {};
    }
  }

  get globalLogContext(): GlobalLogContext {
    return this.request.context.globalLogContext;
  }

  set globalLogContext(globalLogContext: GlobalLogContext) {
    this.request.context.globalLogContext = globalLogContext;
  }

  get tenantContext(): TenantContext {
    return this.request.context.tenantContext;
  }

  set tenantContext(tenantContext: TenantContext) {
    this.request.context.tenantContext = tenantContext;
  }

  get tenantUserContext(): TenantUserContext {
    return this.request.context.tenantUserContext;
  }

  set tenantUserContext(tenantUserContext: TenantUserContext) {
    this.request.context.tenantUserContext = tenantUserContext;
  }

  get userContext(): UserContext {
    return this.request.context.userContext;
  }

  set userContext(userContext: UserContext) {
    this.request.context.userContext = userContext;
  }

  get traceContext(): TraceContext | undefined {
    return this.request?.context?.traceContext;
  }

  set traceContext(traceContext: TraceContext) {
    this.request.context.traceContext = traceContext;
  }

  get clientContext(): ClientContext {
    return this.request.context.clientContext;
  }

  set clientContext(clientContext: ClientContext) {
    this.request.context.clientContext = clientContext;
  }

  get authArtifacts(): AuthArtifacts {
    return this.request.context.authArtifacts;
  }

  set authArtifacts(authArtifacts: AuthArtifacts) {
    this.request.context.authArtifacts = authArtifacts;
  }

  get authentication(): AuthenticationContext {
    return this.request.context.authentication;
  }

  set authentication(authentication: AuthenticationContext) {
    this.request.context.authentication = authentication;
  }
}
