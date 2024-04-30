import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {MailProvider} from 'src/modules/scheduledJobs/notificationSender/emailNotification.enum';
import {NotificationEventType} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/notificationEventType.enum';
import {MailProviderFeatureConfiguration} from './interface';

export const defaultMailProviderFeatureConfiguration: MailProviderFeatureConfiguration = {
  provider: MailProvider.Sendgrid,
  templateProviders: {
    [NotificationEventType.AdminInvited]: MailProvider.MMMHub,
    [NotificationEventType.UserInvited]: MailProvider.MMMHub,
    [NotificationEventType.UserDisabled]: MailProvider.MMMHub,
    [NotificationEventType.RoleChangeToAdmin]: MailProvider.MMMHub,
    [NotificationEventType.RoleChangeToUser]: MailProvider.MMMHub,
    [NotificationEventType.SetupUserPermissions]: MailProvider.MMMHub,
    [NotificationEventType.StaffingRequestStatusInProgress]: MailProvider.MMMHub,
    [NotificationEventType.StaffingRequestStatusSelection]: MailProvider.MMMHub,
    [NotificationEventType.StaffingRequestStatusPartial]: MailProvider.MMMHub,
    [NotificationEventType.StaffingRequestStatusCovered]: MailProvider.MMMHub,
    [NotificationEventType.StaffingRequestCandidateNotAvailable]: MailProvider.MMMHub,
    [NotificationEventType.StaffingRequestApproachingDueDate]: MailProvider.MMMHub,
    [NotificationEventType.CaseClosed]: MailProvider.MMMHub,
  },
};

/**
 * Get the default feature configuration for the Mail Provider feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Mail Provider feature
 */
export const getDefaultMailProviderFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.MailProvider, // TODO: Temporary introducing a new feature configuration until we migrate all of the email templates to MMM Hub
  config: defaultMailProviderFeatureConfiguration,
});
