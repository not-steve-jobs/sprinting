import {ListingPageFeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';

/**
 * Feature to control the elements on the My Colleagues listing page
 *
 * @params {FeatureConfigKey[]} webKeys - Control the columns in the table which is visible on desktop view
 * @params {FeatureConfigKey[]} cardKeys - Control the cards with the details for the Contacts which are visible on mobile view
 * @params {FeatureConfigFilter[]} availableFilters: - Control the filters and their properties
 */
export type MyColleaguesFeatureConfiguration = ListingPageFeatureConfiguration;
