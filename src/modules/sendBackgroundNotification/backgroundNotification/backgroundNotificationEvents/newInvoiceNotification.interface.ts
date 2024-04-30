import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface NewInvoiceNotification extends BaseSingleNotification {
  value: string;
}
