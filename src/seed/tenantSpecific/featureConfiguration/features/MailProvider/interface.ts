import {MailProvider} from 'src/modules/scheduledJobs/notificationSender/emailNotification.enum';

/**
 * Feature to control the Email Provides used by the tenant
 *
 * @param {MailProvider} provider - The default provider which has to be used to send the emails
 * @param {Object} templateProviders - Control the providers which should be used for a specific email templates
 */
export interface MailProviderFeatureConfiguration {
  provider: MailProvider;
  templateProviders: {
    // [key in NotificationEventType]: MailProvider; // TODO: Fix type
    [key: string]: MailProvider;
  };
}
