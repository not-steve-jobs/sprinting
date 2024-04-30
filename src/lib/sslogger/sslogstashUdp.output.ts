import * as Logstash from 'logstash-client';
import {Logger} from 'src/core/logger';
import {SSLogData} from './interfaces/sSLogData.interface';
import {SSLogOutput} from './interfaces/sSLogOutput.interface';

export interface SSLogstashUdpOutputConfig {
  host: string;
  port: number;
  formatFunction?: (logData: SSLogData) => object;
}

const defaultLogFormat = (logData: SSLogData): object => {
  return logData;
};

export class SSLogstashUdpOutput implements SSLogOutput {
  public formatFunction: (logData: SSLogData) => object;
  private readonly logstash: Logstash;

  constructor(configuration: SSLogstashUdpOutputConfig, private readonly logger: Logger) {
    this.formatFunction = configuration.formatFunction ?? defaultLogFormat;
    this.logger.errorObject(__filename, {
      type: 'udp',
      host: configuration.host,
      port: configuration.port,
    });
    this.logstash = new Logstash({
      type: 'udp',
      host: configuration.host,
      port: configuration.port,
    });
  }

  public log = (logData: SSLogData): void => {
    const logObj = this.formatFunction(logData);
    this.logstash.send(logObj);
  };
}
