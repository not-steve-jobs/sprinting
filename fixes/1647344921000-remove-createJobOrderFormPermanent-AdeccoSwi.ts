import { INestApplication } from "@nestjs/common";
import { Logger } from 'src/core/logger';
import { FeatureConfigurationFeature } from "src/modules/featureConfiguration/enum/featureConfigurationFeature.enum";
import { FeatureConfiguration } from "src/modules/featureConfiguration/featureConfiguration.entity";
import { FeatureConfigurationRepository } from "src/modules/featureConfiguration/featureConfiguration.repository";
import { FeatureConfigurationService } from "src/modules/featureConfiguration/featureConfiguration.service";
import { FixInterface } from "src/modules/fix/fix.interface";
import { adeccoSwi } from '../src/seed/tenantSpecific/data/tenant.data';

export class RemoveCreateJobOrderFormPermanentFeatureConfigurationAdeccoSwi1647344921000 implements FixInterface {
  public async execute(applicationInstance: INestApplication, logger: Logger): Promise<any> {
    logger.info(__filename, 'Apply fix for removing createJobOrderFormPermanent feature configuration on tenant 137.');

    const featureConfigurationRepository = applicationInstance.get(FeatureConfigurationRepository);
    const featureConfigurationService = applicationInstance.get(FeatureConfigurationService);

    const featureConfiguration: FeatureConfiguration = await featureConfigurationService.getFeatureConfigurationByFeatureName(
      adeccoSwi.id,
      FeatureConfigurationFeature.CreateJobOrderFormPermanent
    );

    if (featureConfiguration) {
      await featureConfigurationRepository.delete(featureConfiguration);
    }

    logger.info(__filename, `Done. Fix applied on FeatureConfiguration.`);
  }
}
