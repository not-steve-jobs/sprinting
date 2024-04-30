import {HttpStatus} from '@nestjs/common';
import {CustomHttpException, IException} from '../httpException.helper';

/**
 * An error that is caused by some problem on the server side
 * @param errorName
 * @param errorData
 * @param detailedMessage
 * @returns
 */
export const createServerError = (
  errorName: string,
  errorData?: Record<string, any>,
  detailedMessage?: string,
  innerError?: any,
): CustomHttpException => {
  return createError(HttpStatus.INTERNAL_SERVER_ERROR, errorName, errorData, detailedMessage, innerError);
};
/**
 *
 * @param errorName An error that is caused by some problem on the client side
 * @param errorData
 * @param detailedMessage
 * @returns
 */
export const createClientError = (
  errorName: string,
  errorData?: Record<string, any>,
  detailedMessage?: string,
  innerError?: any,
): CustomHttpException => {
  return createError(HttpStatus.BAD_REQUEST, errorName, errorData, detailedMessage, innerError);
};

export const createError = (
  httpStatus: HttpStatus,
  errorName: string,
  errorData?: Record<string, any>,
  detailedMessage?: string,
  innerError?: any,
): CustomHttpException => new CustomHttpException(httpStatus, errorName, errorData, detailedMessage, innerError);

const normalizeException = (e?: any): CustomHttpException => {
  if (e === undefined) {
    return createServerError('UnknownError', undefined, 'Received an error being undefined which should never happen');
  }
  if (e instanceof CustomHttpException) {
    return e;
  } else {
    const name = e.name ?? 'UnknownError';
    return createServerError(name, undefined, undefined, e);
  }
};

const maskErrorData = (value: string): string | void => {
  if (value) {
    return value[0] + (value.length > 3 ? `***${value[value.length - 1]}` : '**');
  }
};

const hasErrorName = (someError: any, errorName: string): string => {
  return someError.name === errorName || someError.errorName || someError.message === errorName;
};

const getErrorName = (someError: any): string => {
  return someError.errorName || someError.name;
};

export const ErrorHelperElk = {
  serverSide: createServerError,
  clientSide: createClientError,
  normalizeException: normalizeException,
  maskErrorData: maskErrorData,
  getErrorName,
  wrap: async function wrapAsync(fn: () => Promise<any>, intendedError: IException, errorGuard: string) {
    try {
      await fn();
    } catch (err) {
      if (!errorGuard || hasErrorName(err, errorGuard)) {
        const e = intendedError;
        throw createError(e.httpStatus, e.errorName, e.errorData, e.detailedMessage, err);
      } else {
        throw err;
      }
    }
  },
};
