import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface CaseClosedNotification extends BaseSingleNotification {
  firstName: string;
  caseName: string;
  url: string;
}
