import {Injectable, HttpService} from '@nestjs/common';
import {Logger} from '../../core/logger';
import {AxiosError, AxiosResponse} from 'axios';

@Injectable()
export class CustomHttpService extends HttpService {
  //Use CustomHttpService instead of HttpService to get better error logging
  constructor(private readonly logger: Logger) {
    super();
    this.axiosRef.interceptors.response.use(
      (res: AxiosResponse) => res,
      (error: AxiosError) => {
        const e = CustomHttpService._processAxiosError(error);
        this.logger.errorObject(
          __filename,
          `${e.config.method.toUpperCase()} ${e.config.url}, status: ${e.response?.status}, statusText: ${
            e.response?.statusText
          }`,
        );
        throw e;
      },
    );
  }

  private static _processAxiosError(err: AxiosError): Partial<AxiosError> {
    if (err?.config && err?.response) {
      delete err.request;
      delete err.toJSON;
      delete err.stack;
      err.config = {
        url: err.config.url,
        method: err.config.method,
        data: err.config.data,
        headers: err.config.headers,
        baseURL: err.config.baseURL,
        timeout: err.config.timeout,
      };
      err.response = {
        status: err.response.status,
        statusText: err.response.statusText,
        data: CustomHttpService._processErrorResponseData(err.response.data),
      } as AxiosResponse;

      if (err.config.headers) {
        delete err.config.headers.traceparent;
        delete err.config.headers.tracestate;
        delete err.config.headers['elastic-apm-traceparent'];
      }
      return err;
    } else {
      return err;
    }
  }

  private static _processErrorResponseData(data: unknown): unknown {
    if (!data) return;
    if (typeof data === 'string' && data.startsWith('<!DOCTYPE html>')) return '[REDACTED_HTML_DATA]';

    return data;
  }
}
