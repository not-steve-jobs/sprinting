import {SSLogData} from './interfaces/sSLogData.interface';
import {SSLogOutput} from './interfaces/sSLogOutput.interface';
import {SSTag} from './interfaces/sSTag.interface';

export interface SSConsoleOutputConfig {
  formatFunction?: (logData: SSLogData) => any[];
  levelMapping?: (logData: SSLogData) => 'debug' | 'info' | 'warn' | 'error';
}

const defaultLogFormat = (logData: SSLogData): any[] => {
  let logLine = '';
  logData.tags.forEach((tag: SSTag) => {
    logLine += ` [${tag.name}]`;
  });
  if (logData.message) logLine += ` ${logData.message}`;
  if (logData.data) logLine += `\n${JSON.stringify(logData.data, null, 2)}`;
  return [logLine];
};
const defaultLevelMapping = (): 'info' => 'info';

export class SSConsoleOutput implements SSLogOutput {
  private formatFunction: (logData: SSLogData) => any[];
  private levelMapping: (logData: SSLogData) => 'debug' | 'info' | 'warn' | 'error';
  private memoCache: {[key: string]: 'debug' | 'info' | 'warn' | 'error'} = {};

  constructor(configuration: SSConsoleOutputConfig) {
    // assign immediately the functions to prevent iffing latter
    this.formatFunction = configuration.formatFunction ?? defaultLogFormat;
    this.levelMapping = configuration.levelMapping ?? defaultLevelMapping;
  }

  private getMappedLevel(logData: SSLogData) {
    const memoKey = logData.tags.reduce((carry, value) => carry + value.tagGroup + value.name, '');
    const cacheHit = this.memoCache[memoKey];
    if (cacheHit) {
      return cacheHit;
    }
    this.memoCache[memoKey] = this.levelMapping(logData);
    return this.memoCache[memoKey];
  }

  public log = (logData: SSLogData): void => {
    const logParams = this.formatFunction(logData);
    const mappedLevel = this.getMappedLevel(logData);

    // Note: Find a better way to mock this service and override it in the tests
    if (['a-test'].indexOf(process.env.NODE_ENV) === -1) {
      console[mappedLevel](...logParams); // eslint-disable-line no-console
    }
  };
}
