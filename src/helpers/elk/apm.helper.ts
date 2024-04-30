import moment from 'moment';
import {Injectable} from '@nestjs/common';
import apm from 'elastic-apm-node';
import {AppConfigService} from '../../core/config/appConfig.service';
import {CustomHttpException} from '../httpException.helper';
import {ErrorHelperElk} from './error.helper.elk';

interface IApmIdentifiers {
  elkTraceId?: string;
  tenant?: string;
  region?: string;
  principalName?: string;
  requestTraceId?: string;
  deviceTraceId?: string;
  clientTraceId?: string;
  personIdHash?: string;
  recordId?: string;
  systemTime?: string;
}

export interface IApmIdentifiersRaw {
  elkTraceId?: string;
  tenantId?: number | string;
  regionId?: number | string;
  principalName?: string;
  requestTraceId?: string;
  deviceTraceId?: string;
  clientTraceId?: string;
  personId?: string;
  recordId?: string;
  systemTime?: moment.Moment;
}

export type IApmSpan = {
  end: (endTime?: number) => void;
  addLabels: (i: IApmIdentifiers) => boolean;
};

@Injectable()
export class ApmHelper {
  public readonly apm;
  constructor(private readonly config: AppConfigService) {
    if (this.isEnabled()) {
      this.apm = apm;
      if (!this.apm.isStarted()) {
        const agentConfigOptions = {
          serviceName: this.config.elasticApm.serviceName,
          environment: this.config.envPrefix,
          serverUrl: this.config.elasticApm.serverUrl,
          transactionSampleRate: this.config.elasticApm.transactionSampleRate,
          secretToken: this.config.elasticApm.secretToken,
          cloudProvider: this.config.elasticApm.cloudProvider,
        };

        try {
          this.apm.start(agentConfigOptions);
          // eslint-disable-next-line no-console
          console.log('APM service is up. Data will be send');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error.toString());
          this.apm = null;
        }
      }
    }
  }
  /**
   * Will return false
   * - if running TESTS or
   * - APM is not enabled or
   * - APM instance is unavailable
   */

  public isEnabled(): boolean {
    return this.config.elasticApm.enabled;
  }

  public tailing(): boolean {
    return !!this.apm.currentTransaction;
  }

  private formatFileName(filePath: string): string {
    const result = filePath.substr(filePath.lastIndexOf('/') + 1); //.replace(/[^a-zA-Z0-9]/g, '_');
    return result.split('.')[0];
  }

  private formatFileNameWithBrackets(filePath: string): string {
    return `[${this.formatFileName(filePath)}]`;
  }

  /**
   * @returns The transaction ID from the current APM transaction. Will be
   * undefined if no such transaction exists.
   */
  getTransactionId() {
    if (!this.apm) return;
    // currentTransaction has not attr ids!
    const ids: any = this.apm.currentTransaction?.ids;
    if (ids) {
      return ids['transaction.id'];
    }
  }
  /**
   * Sends the error to APM.
   */
  public captureError(anyError: any) {
    if (!this.apm) return;
    const exception: CustomHttpException = ErrorHelperElk.normalizeException(anyError);

    this.apm.captureError(exception, {
      handled: true,
      //use only string or int types
      labels: {
        errorName: exception.errorName,
        errorTraceId: exception.errorTraceId,
      },
      custom: {
        errorName: exception.errorName,
        errorTraceId: exception.errorTraceId,
        errorString: exception.toString(),
        message: exception.message,
        detailedMessage: exception.detailedMessage,
        innerError: JSON.stringify(exception.innerError?.data),
      },
    });
  }
  /**
   * Logs an object as custom context of the current transaction. This same message will be attached to the error object in APM.
   */
  public logContextObject(fileName: string, obj: Record<string, any>): void {
    if (!this.apm) return;
    this.apm.setCustomContext({[this.formatFileName(fileName)]: {...obj}});
  }
  /**
   * Logs a message as a custom context on the current transaction. This same message will be attached to the error object in APM.
   * @param message
   * @param fileName The name of the file (javascript module) from which this message is logged.
   */
  public logMessage(fileName: string, message: string): void {
    if (!this.apm) return;
    this.apm.setCustomContext({[this.formatFileName(fileName)]: {message: message}});
  }
  /**
   * Call this to start a span that you have to end yourself. Note:
   * If the transaction sampling rate of APM is below 1, the a fraction of the
   * time you access apm.currentTransaction, it will be empty.
   */
  public startSpan(name: string, type: string, action: string, subtype?: string): IApmSpan | undefined {
    if (this.apm && this.apm?.currentTransaction) {
      return this.apm.currentTransaction.startSpan(name, type, subtype, action);
    } else {
      return;
    }
  }
  public endSpan(span: IApmSpan, endTime?: number): void {
    if (span) {
      span.end(endTime);
    }
  }

  private startTransactionBase(
    name: string | null,
    type: string | null,
    subtype: string | null,
    action: string | null,
    options?: any,
  ): any {
    if (!this.apm) return;
    return this.apm.startTransaction(name, type, subtype, action, options);
  }

  public startTransaction(name: string, label: string, castAs = 'request'): any {
    if (!this.apm) return;
    const transaction = this.startTransactionBase(name, castAs, null, null);
    transaction.setLabel('transType', label);
    return transaction;
  }
  public endTransaction(result?: string | number, endTime?: number): void {
    if (!this.apm) return;
    return this.apm.endTransaction(result, endTime);
  }

  /**
   * Will set label on if current transaction exists
   */
  public setLabelToCurrentTrans(labelName: string, value: string): void {
    if (this.apm?.currentTransaction) {
      this.apm.currentTransaction.setLabel(labelName, value);
    }
  }
}
