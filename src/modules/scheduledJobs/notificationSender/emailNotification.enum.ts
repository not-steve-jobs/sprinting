/**
 * List of predefined constants for all of the available email providers
 * TODO: Introducing this to simplify the usage across the code and avoid using fixed strings
 * but this enum should be removed once we deprecate the Sendgrid provider
 */
export enum MailProvider {
  Sendgrid = 'Sendgrid',
  MMMHub = 'MMM Hub',
}

/**
 * List of predefined constants for all of the available definition keys for the MMM Hub API
 */
export enum MmmHubApiDefinitionKeys {
  GlobalClientAccess = 'API_Email_Global_ClientAccess',
}
