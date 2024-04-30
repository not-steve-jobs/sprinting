import {SSLogData} from './sSLogData.interface';
import {SSLogOutput} from './sSLogOutput.interface';
import {SSTag} from './sSTag.interface';

export interface SSLoggerInterface {
  tags: SSTag[];
  logOutputs: SSLogOutput[];
  log: (logData: SSLogData) => void;
}
