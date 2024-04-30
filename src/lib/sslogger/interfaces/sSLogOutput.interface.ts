import {SSLogData} from './sSLogData.interface';

export interface SSLogOutput {
  log: (logData: SSLogData) => void;
}
