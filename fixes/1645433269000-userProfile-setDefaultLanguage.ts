import {INestApplication} from '@nestjs/common';
import {Logger} from 'src/core/logger';
import {EntityManager} from 'typeorm';

import {FixInterface} from 'src/modules/fix/fix.interface';
import {UserProfile} from 'src/modules/userProfile/userProfile.entity';
import {englishUsa} from 'src/seed/tenantSpecific/featureConfiguration/features/Localization/data/languages.data';

export class UserProfileSetDefaultLanguage1640103587000 implements FixInterface {
  public async execute(applicationInstance: INestApplication, logger: Logger): Promise<any> {
    logger.info(__filename, 'Apply fix for all old UserProfiles without language, set "en_US" as default.');
    const entityManager = applicationInstance.get(EntityManager);

    const userProfiles: UserProfile[] = await this.getUserProfilesWithoutLanguage(entityManager);
    const userProfilesWithDefaultLanguage: UserProfile[] = this.setUserProfilesDefaultLanguage(userProfiles);

    await entityManager.save(userProfilesWithDefaultLanguage);
    logger.info(__filename, `Done. Fix applied on ${userProfilesWithDefaultLanguage.length} users.`);
  }

  private async getUserProfilesWithoutLanguage(entityManager: EntityManager): Promise<UserProfile[]> {
    return entityManager.find(UserProfile, {
      where: {
        language: null,
      },
    });
  }

  private setUserProfilesDefaultLanguage(userProfiles: UserProfile[]): UserProfile[] {
    return userProfiles.map((userProfile) => {
      return new UserProfile({
        ...userProfile,
        language: englishUsa.code,
      });
    });
  }
}
