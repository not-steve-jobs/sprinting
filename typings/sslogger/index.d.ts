import {SSLogData} from '../../src/lib/sslogger/interfaces/sSLogData.interface';

declare module '../../src/lib/sslogger/interfaces/sSLogData.interface' {
  export interface SSLogData {
    filename: string;
    error?: any;
    event?: any;
  }
}
