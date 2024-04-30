import {Injectable} from '@nestjs/common';
import * as dateFns from 'date-fns';
import * as path from 'path';
import {AzureApplicationInsightsHelper} from '../helpers/azureApplicationInsights.helper';
import {UtilsHelper} from '../helpers/utils.helper';
import {SSConsoleOutput} from '../lib/sslogger/ssconsole.output';
import {
  SSLogger,
  SSLoggerDebugLevelTag,
  SSLoggerDefaultTags,
  SSLoggerErrorLevelTag,
  SSLoggerInfoLevelTag,
  SSLoggerTraceLevelTag,
} from '../lib/sslogger/sslogger';
import {SSLogData} from '../lib/sslogger/interfaces/sSLogData.interface';
import {ApmHelper} from '../helpers/elk/apm.helper';

const SSLoggerTextLogTypeTag = {tagGroup: 'type', name: 'text-log', order: 0};
const SSLoggerErrorTypeTag = {tagGroup: 'type', name: 'error', order: 1};
const SSLoggerEventTypeTag = {tagGroup: 'type', name: 'event', order: 2};

// removed contextService - crashing when logger called from scheduled task
@Injectable()
export class Logger extends SSLogger {
  constructor(
    private utils: UtilsHelper,
    private azureApplicationInsightsHelper: AzureApplicationInsightsHelper,
    private apmHelper: ApmHelper,
  ) {
    super({
      tags: SSLoggerDefaultTags,
    });
    this.logOutputs.push(
      new SSConsoleOutput({
        levelMapping: this.consoleLevelMapping,
        formatFunction: this.consoleOutputFormat,
      }),
    );
  }

  private static processFilename(filename: string): string {
    if (!filename) {
      return 'N\\A';
    }

    const parts = filename.split(path.sep);
    return `${parts[parts.length - 2]}/${parts.pop()}`;
  }

  private consoleLevelMapping = (logData: SSLogData): 'debug' | 'info' | 'warn' | 'error' => {
    if (logData.tags.find((x) => ['emergency', 'alert', 'critical', 'error'].includes(x.name))) {
      return 'error';
    }
    if (logData.tags.find((x) => ['warning', 'notice'].includes(x.name))) {
      return 'warn';
    }
    if (logData.tags.find((x) => ['info'].includes(x.name))) {
      return 'info';
    }
    return 'debug';
  };

  private consoleOutputFormat = (logData: SSLogData): any[] => {
    const parts = [
      `*app*`,
      `[${dateFns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS")}]`,
      `[${logData.tags
        .map((x) => x.name)
        .join('|')
        .toUpperCase()}]`, // level
      `[${Logger.processFilename(logData.filename)}]`, // calling module
      '[--> ', // start message
      logData.message ? logData.message : '', // message
      ' <--]', // end message
    ];
    if (logData.error) {
      parts.push(`\n${logData.error.stack.replace('\n', '\n\t')}`);
    }
    if (logData.data) {
      parts.push(`\n${this.utils.dump(logData.data)}\n\t`);
    }
    if (logData.event) {
      parts.push(`\n${this.utils.dump(logData.event)}\n\t`);
    }
    return [parts.join(' ')];
  };

  public trace(filename: string, message: string, data?: any) {
    this.azureApplicationInsightsHelper.trackTrace(filename, message, data);
    return this.log({
      tags: [SSLoggerTraceLevelTag, SSLoggerTextLogTypeTag],
      filename,
      message,
      data,
    });
  }

  public debug(filename: string, message: string, data?: any) {
    this.azureApplicationInsightsHelper.trackTrace(filename, message, data);
    return this.log({
      tags: [SSLoggerDebugLevelTag, SSLoggerTextLogTypeTag],
      filename,
      message,
      data,
    });
  }

  public info(filename: string, message: string, data?: any) {
    this.azureApplicationInsightsHelper.trackInfo(filename, message, data);
    return this.log({
      tags: [SSLoggerInfoLevelTag, SSLoggerTextLogTypeTag],
      filename,
      message,
      data,
    });
  }

  public error(filename: string, message: string, data?: any) {
    this.azureApplicationInsightsHelper.trackError(filename, message, data);
    return this.log({
      tags: [SSLoggerErrorLevelTag, SSLoggerTextLogTypeTag],
      filename,
      message,
      data,
    });
  }

  public errorObject(filename: string, error: any) {
    this.azureApplicationInsightsHelper.trackErrorObject(filename, error);
    this.log({
      tags: [SSLoggerErrorLevelTag, SSLoggerErrorTypeTag],
      filename,
      message: `Error ${error.name}`,
      error,
    });
    /**
     * Sends the error to APM.
     */
    this.apmHelper.captureError(error);
  }

  public event(filename: string, eventName: string, domain: string, category: string, data?: any) {
    this.azureApplicationInsightsHelper.trackEvent(filename, eventName, data);
    this.log({
      filename,
      tags: [SSLoggerInfoLevelTag, SSLoggerEventTypeTag],
      message: eventName,
      event: {
        name: eventName,
        category,
        domain,
        data,
      },
    });
  }
}
