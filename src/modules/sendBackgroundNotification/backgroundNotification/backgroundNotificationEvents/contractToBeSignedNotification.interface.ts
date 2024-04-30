import {BaseGroupNotification} from './baseGroupNotification.interface';

export interface ContractToBeSignedNotification extends BaseGroupNotification {
  contractNumber: string;
  createdAt: string;
  dateStart: string;
  dateEnd: string;
}
