import {HttpException} from '@nestjs/common';
export type IException = {
  errorTraceId?: string;
  httpStatus: number;
  errorName: string;
  errorData?: Record<string, any>;
  detailedMessage?: string;
  innerError?: any;
  toJson(): string;
};
/**
 * @returns An error ID on the form ERR-R4YH67CR
 */
const getTraceId = (): string => {
  const symbols = '123456789ABCDEFGHJKMNPQRSTUVXYZ'.split('');
  const N = symbols.length;
  const randomSymbols = [1, 2, 3, 4, 5, 6, 7, 8].map(() => symbols[Math.floor(Math.random() * (N - 1))]); //NOSONAR - Math.random is used to create unique identifier
  return `ERR-${randomSymbols.join('')}PS`;
};
/**
 * An exception class that should be used throughout the application.
 */
export class CustomHttpException extends HttpException implements IException {
  public readonly errorTraceId = getTraceId();
  constructor(
    public readonly httpStatus: number,
    public readonly errorName: string,
    public readonly errorData?: Record<string, any>,
    public readonly detailedMessage?: string,
    public readonly innerError?: any,
  ) {
    super(errorName, httpStatus);
  }
  toJson(): any {
    return {
      errorName: this.errorName,
      innerError: this.innerError,
      errorData: this.errorData,
      detailedMessage: this.detailedMessage,
      httpStatus: this.httpStatus,
    };
  }
}
