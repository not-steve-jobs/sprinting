/**
 * List with demo data used to generate "random" seeds
 */

import {LocationStatusEnum} from 'src/modules/location/location.enum';

export const DEMO_LOCATION_NAMES: string[] = [
  'Berlin Tech center',
  'London Tech 1',
  'Madrid Tech 1',
  'Munchen Tech 1',
  'Birmingham Tech 1',
  'Frankfurt Tech 1',
  'Barcelona Tech 1',
  'Valencia Tech 1',
  'Mannheim Tech 1',
  'Stuttgart Tech 1',
];

export const DEMO_STREETS: string[] = [
  'Friedrich',
  'Queensway',
  'Calle Orense',
  'Church Street North',
  'Orchard Lane',
  '2nd Street',
  'Cardinal Drive',
  'Maiden Lane',
  'East Street',
  'Elizabeth Street',
];

export const DEMO_NUMBERS: string[] = ['68', '23-25', '69', '11', '23', '42', '123', '111', '436', '333'];

export const DEMO_CITIES: string[] = [
  'Berlin',
  'London',
  'Madrid',
  'Munchen',
  'Birmingham',
  'Frankfurt',
  'Barcelona',
  'Valencia',
  'Mannheim',
  'Stuttgart',
];

// TODO: Those doesn't look like states?
export const DEMO_STATES: string[] = [
  'Germany',
  'United Kingdom',
  'Spain',
  'France',
  'Belgium',
  'Czech Republic',
  'Denmark',
  'Greece',
  'Italy',
  'Finland',
];

export const DEMO_COUNTRIES: string[] = [
  'Germany',
  'United Kingdom',
  'Spain',
  'France',
  'Belgium',
  'Czech Republic',
  'Denmark',
  'Greece',
  'Italy',
  'Finland',
];

export const DEMO_ZIP_CODES: string[] = [
  '10117',
  '22117',
  '38117',
  '12312',
  '32145',
  '1242',
  '42311',
  '52314',
  '74421',
  '95523',
];

export const DEMO_LOCATION_STATUSES: string[] = Object.values(LocationStatusEnum);
