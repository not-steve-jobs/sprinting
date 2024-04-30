import {Injectable} from '@nestjs/common';
import * as appInsights from 'applicationinsights';
import SeverityLevel from 'applicationinsights/out/Declarations/Contracts/Generated/SeverityLevel';
import path from 'path';
import util from 'util';
import {AppConfigService} from '../core/config/appConfig.service';
import {UtilsHelper} from './utils.helper';

//headers must be lower-cased :)
const MANDATORY_ENABLED_HEADERS_LOWERCASED = [
  'accept-language',
  'referer',
  'origin',
  'x-api-version',
  'x-client-traceId',
  'x-device-platform',
  'x-request-traceId',
  'x-tenantId',
  'x-tenant-alias',
  'x-tenantalias',
  'x-requested-with',
  'x-client-commit-id',
  'x-client-release-version',
  'host',
  'accept',
  'user-agent',
];

function strip(filename: string) {
  if (!filename) {
    return 'N\\A';
  }

  const parts = filename.split(path.sep);
  return `${parts[parts.length - 2]}/${parts.pop()}`;
}

@Injectable()
export class AzureApplicationInsightsHelper {
  private readonly isEnabled: boolean = false;

  constructor(appConfig: AppConfigService, private readonly utils: UtilsHelper) {
    this.isEnabled = appConfig.azureApplicationInsights.enabled;
    if (!this.isEnabled) return;

    const enabledHeaders = MANDATORY_ENABLED_HEADERS_LOWERCASED;

    appInsights
      .setup(appConfig.azureApplicationInsights.instrumentationKey)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(false)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
      .start();

    appInsights.defaultClient.addTelemetryProcessor((envelope, context) =>
      this._filterHTTPConfiguration(envelope, context, enabledHeaders),
    );
  }

  private _filterHTTPConfiguration = (
    envelope: appInsights.Contracts.EnvelopeTelemetry,
    context: {
      [name: string]: any;
    },
    enabledHeaders: string[],
  ): boolean => {
    const httpRequest = context['http.ServerRequest'];
    const envelopeBaseData = envelope.data?.baseData;
    if (envelopeBaseData) {
      envelopeBaseData.url = envelopeBaseData.url && this.utils.maskEmails(envelopeBaseData.url);
      envelopeBaseData.name = envelopeBaseData.name && this.utils.maskEmails(envelopeBaseData.name);
    }
    if (httpRequest && appInsights.Contracts.domainSupportsProperties(envelope.data.baseData)) {
      Object.keys(httpRequest.headers).forEach((headerName) => {
        if (enabledHeaders.indexOf(headerName.toLowerCase()) !== -1) {
          envelope.data.baseData.properties[`header-${headerName}`] = httpRequest.headers[headerName];
        }
      });
    }
    return true;
  };

  public trackTrace(filename: string, message: string, data?: any) {
    if (!this.isEnabled) return;
    appInsights.defaultClient.trackTrace({
      message: message,
      properties: {filename: strip(filename), data: data},
      severity: SeverityLevel.Verbose,
    });
  }

  public trackInfo(filename: string, message: string, data?: any) {
    if (!this.isEnabled) return;
    appInsights.defaultClient.trackTrace({
      message: message,
      properties: {filename: strip(filename), data: data},
      severity: SeverityLevel.Information,
    });
  }

  public trackError(filename: string, message: string, data?: any) {
    if (!this.isEnabled) return;
    appInsights.defaultClient.trackTrace({
      message: message,
      properties: {filename: strip(filename), data: data},
      severity: SeverityLevel.Error,
    });
  }

  public trackErrorObject(filename: string, error: any) {
    if (!this.isEnabled) return;
    if (error.errorTraceId) {
      error.message = `(${error.errorTraceId})${error.message}`;
    }
    if (error.data) {
      error.message += util.inspect(error.data);
    }
    if (error.innerError) {
      error.message += `InnerError: ${error.innerError.name}`;
      error.message += ` Message: ${error.innerError.message}`;
      error.message += ` Stack: ${error.innerError.stack}`;
    }
    appInsights.defaultClient.trackException({
      exception: error,
      properties: error.data,
    });
  }

  public trackEvent(filename: string, eventName: string, eventData: any) {
    if (!this.isEnabled) return;
    appInsights.defaultClient.trackEvent({
      name: eventName,
      properties: {filename: strip(filename), eventData: eventData},
    });
  }
}
