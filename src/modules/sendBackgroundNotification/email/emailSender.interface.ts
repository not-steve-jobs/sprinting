import {EmailMessage} from './emailMessage.interface';

export interface EmailSender {
  sendMail(message: EmailMessage): Promise<void>;
}
