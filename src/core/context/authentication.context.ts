import {JwtHeader} from 'jsonwebtoken';
import {ErrorBase} from '../../lib/appErrorBase/errorBase.interface';

export class AuthenticationContext {
  error: ErrorBase<any>;
  token: string;
  nonVerifiedJwtToken: {header: JwtHeader; payload: Record<string, any>};
}
