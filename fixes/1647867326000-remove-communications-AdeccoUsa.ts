import { INestApplication } from "@nestjs/common";
import { Logger } from 'src/core/logger';
import { FeatureConfigurationFeature } from "src/modules/featureConfiguration/enum/featureConfigurationFeature.enum";
import { FeatureConfiguration } from "src/modules/featureConfiguration/featureConfiguration.entity";
import { FeatureConfigurationRepository } from "src/modules/featureConfiguration/featureConfiguration.repository";
import { FeatureConfigurationService } from "src/modules/featureConfiguration/featureConfiguration.service";
import { FixInterface } from "src/modules/fix/fix.interface";
import { adeccoUsa } from '../src/seed/tenantSpecific/data/tenant.data';

export class RemoveCommunicationsFeatureConfigurationAdeccoUsa1647867326000 implements FixInterface {
  public async execute(applicationInstance: INestApplication, logger: Logger): Promise<any> {
    logger.info(__filename, 'Apply fix for removing Communication feature configuration on tenant 101(USA).');

    const featureConfigurationRepository = applicationInstance.get(FeatureConfigurationRepository);
    const featureConfigurationService = applicationInstance.get(FeatureConfigurationService);

    const featureConfiguration: FeatureConfiguration = await featureConfigurationService.getFeatureConfigurationByFeatureName(
      adeccoUsa.id,
      FeatureConfigurationFeature.Communications
    );

    if (featureConfiguration) {
      await featureConfigurationRepository.delete(featureConfiguration);
    }

    logger.info(__filename, `Done. Fix applied on FeatureConfiguration.`);
  }
}
