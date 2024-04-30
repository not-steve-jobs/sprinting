import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {SupportedFileTypesForUploadFeatureConfiguration} from './interface';

export const defaultSupportedFileTypesForUploadFeatureConfiguration: SupportedFileTypesForUploadFeatureConfiguration = {
  maxFileSizeInMB: 20,
  maxNumberOfFiles: 3,
  supportedFileTypes: [
    'jpg',
    'jpeg',
    'gif',
    'png',
    'doc',
    'docx',
    'ppt',
    'pptx',
    'pps',
    'ppsx',
    'odt',
    'xls',
    'xlsx',
    'txt',
    'rtf',
    'pdf',
    'notes',
    'snotes',
    'zip',
    'dot',
    'dotx',
    'xlt',
    'xla',
    'xltx',
    'pot',
    'ppa',
    'potx',
  ],
  supportedFileTypesErrorMessage: ['WORD', 'EXCEL', 'PPT', 'PDF', 'JPEG', 'PNG', 'ZIP'],
};

/**
 * Get the default feature configuration for the Supported File Types for Upload feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Supported File Types for Upload feature
 */
export const getDefaultSupportedFileTypesForUploadFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.SupportedFileTypesForUpload,
  config: defaultSupportedFileTypesForUploadFeatureConfiguration,
});
