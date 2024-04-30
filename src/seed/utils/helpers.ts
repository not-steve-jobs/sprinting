import * as dateFns from 'date-fns';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {Status} from 'src/modules/status/status.entity';
import {getRandomIntIndex} from './seed.utils';

/**
 * Filter out the list of items which belongs to a specific Tenant
 *
 * @param {T} items - List with items which we want to filter out
 * @param {number} tenantId - The ID of the Tenant which should be used to filter out the items
 * @returns {T[]}
 */
export const filterEntitiesByTenantId = <T extends {tenantId: number}>(items: T[], tenantId: number): T[] => {
  return items.filter((item: T) => item.tenantId === tenantId);
};

// TODO: Fix type once the FeatureConfigurations types are applied
export const getFeatureConfiguration = (
  tenantFeatureConfiguration: any,
  feature: FeatureConfigurationFeature,
  channel: FeatureConfigurationChannel,
): any => {
  return tenantFeatureConfiguration.find((featureConfiguration) => {
    return featureConfiguration.feature === feature && featureConfiguration.channel === channel;
  });
};

export const generateRandomDate = (start: Date, end: Date): Date => {
  const startTimestamp: number = dateFns.getTime(start);
  const endTimestamp: number = dateFns.getTime(end);

  return dateFns.toDate(startTimestamp + UtilsHelper.randomNumber() * (endTimestamp - startTimestamp));
};

export const generateRandomInteger = (min: number, max: number): number => {
  return Math.floor(UtilsHelper.randomNumber() * (max - min + 1)) + min;
};

export const filterStatusesByEntityName = (statuses: Status[], tenantId: number, entityName: string): Status[] => {
  return statuses.filter((status: Status) => {
    return status.tenantId === tenantId && status.entityName === entityName;
  });
};

/**
 * Add leading 0s to a specific ID number
 * Example: 0000-0000-0001
 *
 * @param {number} number - The number we want to transform
 * @param {number} places - The amount of zeroes which should be prepended
 * @returns {string}
 */
export const zeroPad = (number: number, places: number): string => {
  return String(number).padStart(places, '0');
};

export const getRandomItem = <T>(items: T[] = []): T => {
  if (items.length === 0) {
    return null;
  }

  const randomIndex = getRandomIntIndex(items.length);
  return items[randomIndex];
};

export const getRandomItemId = <T extends {id: number | string}>(items: T[] = []): number | string => {
  if (items.length === 0) {
    return null;
  }

  const randomEntity: T = getRandomItem(items);
  return randomEntity.id;
};
