import * as jwt from 'jsonwebtoken';
import * as dateFns from 'date-fns';
import {Algorithm, JwtHeader} from 'jsonwebtoken';
import {JwtHelperErrors} from './jwtHelper.error';

const _generate = (data: Record<string, any>, alg: Algorithm, key: string, expires: string): string => {
  const expDate = dateFns.parseISO(expires);
  const expInSeconds = dateFns.millisecondsToSeconds(dateFns.getTime(expDate));
  const dataToSign = {...data, exp: expInSeconds};

  return jwt.sign(dataToSign, key, {algorithm: alg});
};

export class JwtHelper {
  /**
   * Strips the jwtString of starting Bearer text
   */
  public static stripBearer(jwtString: string): string {
    if (jwtString.startsWith('Bearer ')) {
      return jwtString.substring(7);
    }
    return jwtString;
  }

  /**
   * Returns complete JWT as object ({ payload, headers})
   */
  public static decodeCompleteToken(jwtToken: string): {header: JwtHeader; payload: Record<string, any>} {
    return jwt.decode(jwtToken, {complete: true, json: true}) as {header: JwtHeader; payload: Record<string, any>};
  }

  /**
   * Returns JWT payload as object
   */
  public static decodePayload(jwtToken: string): Record<string, any> {
    return jwt.decode(jwtToken, {json: true});
  }

  /**
   * @param {Object} data Data to add to payload
   * @param {string} key Encryption key
   * @param {string} expires Expiration date in ISO time
   */
  public static generateHS256(data: Record<string, any>, key: string, expires: string): string {
    return _generate(data, 'HS256', key, expires);
  }

  /**
   * @param {Object} data Data to add to payload
   * @param {string} key Encryption key
   * @param {string} expires Expiration date in ISO time
   */
  public static generateHS512(data: Record<string, any>, key: string, expires: string): string {
    return _generate(data, 'HS512', key, expires);
  }

  /**
   * @param {Object} data Data to add to payload
   * @param {string} key Encryption key
   * @param {string} expires Expiration date in ISO time
   */
  public static generateRS256(data: Record<string, any>, key: string, expires: string): string {
    return _generate(data, 'RS256', key, expires);
  }

  /**
   * Verifies and parses jwt.
   * @param {string} key Key for JWT verifying
   * @param {string[]} alghoritms Allowed algorithms
   * @param {string} jwtToken String containing JWT
   * @param additionalChecks: {[string]: any}
   * @return {Object} Payload data
   */
  public static parseJwt(
    key: string,
    algorithms: Algorithm[],
    jwtToken: string,
    additionalChecks?: jwt.VerifyOptions,
  ): Record<string, any> {
    const checks: jwt.VerifyOptions = {algorithms, ...(additionalChecks ?? {})};
    try {
      return jwt.verify(jwtToken, key, checks) as Record<string, any>;
    } catch (e) {
      switch (e.message) {
        case 'invalid algorithm':
          throw new JwtHelperErrors.JwtTokenInvalidAlgorithmError();
        case 'jwt expired':
          throw new JwtHelperErrors.JwtTokenExpiredError();
        case 'jwt malformed':
          throw new JwtHelperErrors.JwtTokenMalformedError();
        default:
          throw new JwtHelperErrors.JwtTokenNotValidError({reason: e.message});
      }
    }
  }
}
