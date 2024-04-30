import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {Algorithm} from 'jsonwebtoken';
import JwksRsa, {JwksClient} from 'jwks-rsa';
import {JwtHelper} from 'src/helpers/jwt.helper';
import {AppConfigService} from '../config/appConfig.service';
import {AuthError} from './auth.error';

@Injectable()
export class AzureIdpAuthMiddleware implements NestMiddleware<Request, Response> {
  private clientJWKS: JwksClient;

  constructor(private readonly appConfigService: AppConfigService) {
    const azureIdpConf = this.appConfigService.authConfig.AzureIdp;

    this.clientJWKS = JwksRsa({
      cache: true,
      cacheMaxEntries: azureIdpConf.keyCacheMaxEntries,
      jwksUri: azureIdpConf.jwksUri,
    });
  }

  async use(request: Request, res: Response, next: () => void): Promise<void> {
    const azureIdpConf = this.appConfigService.authConfig.AzureIdp;
    const authContext = request.context.authentication;

    // skip this middleware if no bearer token or token can't be decoded
    if (authContext.error) {
      return next();
    }

    // skip this middleware if already have artifacts produced by another
    if (request.context.authArtifacts) {
      return next();
    }

    const nonVerifiedJwtToken = authContext.nonVerifiedJwtToken;

    if (nonVerifiedJwtToken.payload.iss.toLowerCase() !== azureIdpConf.azureIss) {
      return next();
    }

    let verifiedPayload;
    try {
      verifiedPayload = await this._handleAzureToken(
        authContext.token,
        nonVerifiedJwtToken.header.kid,
        nonVerifiedJwtToken.header.alg as Algorithm,
      );
    } catch (e) {
      authContext.error = e;
      return next();
    }

    if (!verifiedPayload?.email) {
      authContext.error = new AuthError.AuthTokenNoEmailFieldError();
      return next();
    }

    request.context.authArtifacts = {
      authType: 'azureIdp',
      userEmail: verifiedPayload?.email,
      B2CId: verifiedPayload.sub,
      tenantId: verifiedPayload.tenantId ?? request.context.tenantContext.tenantId,
      userId: null,
    };

    return next();
  }

  private async _getPublicKey(kid: string): Promise<string> {
    const signingKey = await this.clientJWKS.getSigningKey(kid);
    const publicKey = signingKey.getPublicKey();

    return publicKey;
  }

  private async _handleAzureToken(token: string, kid: string, alg: Algorithm = 'RS256'): Promise<Record<string, any>> {
    try {
      const publicKey = await this._getPublicKey(kid);
      return JwtHelper.parseJwt(publicKey, [alg], token, {clockTolerance: 5});
    } catch (e) {
      throw new AuthError.AuthAzureIdpPayloadVerificationError(null, e);
    }
  }
}
