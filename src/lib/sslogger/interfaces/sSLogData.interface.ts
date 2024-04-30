import {SSTag} from './sSTag.interface';

export interface SSLogData {
  message?: string;
  data?: any;
  tags: SSTag[];
}
