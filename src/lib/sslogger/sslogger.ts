import {EventEmitter} from 'events';
import {SSLogData} from './interfaces/sSLogData.interface';
import {SSLoggerInterface} from './interfaces/sSLoggerInterface.interface';
import {SSLoggerOptions} from './interfaces/sSLoggerOptions.interface';
import {SSLogOutput} from './interfaces/sSLogOutput.interface';
import {SSTag} from './interfaces/sSTag.interface';

export const SSLoggerEmergencyLevelTag = {
  tagGroup: 'level',
  name: 'emergency',
  order: 0,
};
export const SSLoggerAlertLevelTag = {
  tagGroup: 'level',
  name: 'alert',
  order: 1,
};
export const SSLoggerCriticalLevelTag = {
  tagGroup: 'level',
  name: 'critical',
  order: 2,
};
export const SSLoggerErrorLevelTag = {
  tagGroup: 'level',
  name: 'error',
  order: 3,
};
export const SSLoggerWarningLevelTag = {
  tagGroup: 'level',
  name: 'warning',
  order: 4,
};
export const SSLoggerNoticeLevelTag = {
  tagGroup: 'level',
  name: 'notice',
  order: 5,
};
export const SSLoggerInfoLevelTag = {
  tagGroup: 'level',
  name: 'info',
  order: 6,
};
export const SSLoggerDebugLevelTag = {
  tagGroup: 'level',
  name: 'debug',
  order: 7,
};
export const SSLoggerTraceLevelTag = {
  tagGroup: 'level',
  name: 'trace',
  order: 8,
};

export const SSLoggerDefaultTags = [
  SSLoggerEmergencyLevelTag,
  SSLoggerAlertLevelTag,
  SSLoggerCriticalLevelTag,
  SSLoggerErrorLevelTag,
  SSLoggerWarningLevelTag,
  SSLoggerNoticeLevelTag,
  SSLoggerInfoLevelTag,
  SSLoggerDebugLevelTag,
  SSLoggerTraceLevelTag,
];

export class SSLogger implements SSLoggerInterface {
  private eventEmitter!: EventEmitter;
  public tags!: SSTag[];
  public logOutputs!: SSLogOutput[];

  constructor(options: SSLoggerOptions) {
    this.eventEmitter = new EventEmitter();
    this.tags = options.tags;
    this.logOutputs = [];
  }

  public addBeforeLogListener = (listener: (logData: SSLogData) => void): this => {
    this.eventEmitter.addListener('before', listener);
    return this;
  };

  public addAfterLogListener = (listener: (logData: SSLogData) => void): this => {
    this.eventEmitter.addListener('after', listener);
    return this;
  };

  public log(logData: SSLogData) {
    this.logToOutputs(logData);
  }

  private logToOutputs(logData: SSLogData) {
    this.eventEmitter.emit('before', logData);
    this.logOutputs.forEach((x) => x.log(logData));
    this.eventEmitter.emit('after', logData);
  }
}
