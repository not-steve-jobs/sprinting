/**
 * List with demo data used to generate "random" seeds
 */

import {DaysInWeekEnum} from 'src/modules/jobOrder/jobOrder.enum';

export const DEMO_JOB_ORDER_NAMES: string[] = ['Job order', 'Job order name', 'Name', 'Some name for job order'];

export const DEMO_START_DATES: string[] = [
  '2020-01-01 09:00:00',
  '2019-03-06 08:00:00',
  '2019-01-01 10:30:00',
  '2018-11-11 13:00:00',
  '2021-01-07 05:30:00',
  '2020-10-19 06:00:00',
  '2020-02-18 06:30:00',
];

export const DEMO_END_DATES: string[] = [
  '2021-02-10 16:30:00',
  '2021-02-22 17:00:00',
  '2021-04-24 17:30:00',
  '2021-06-11 18:00:00',
  '2021-11-11 19:00:00',
  '2022-01-01 20:30:00',
  '2022-10-10 22:00:00',
];

export const DEMO_DAYS_IN_WEEK: DaysInWeekEnum[][] = [
  [DaysInWeekEnum.MONDAY],
  [
    DaysInWeekEnum.MONDAY,
    DaysInWeekEnum.TUESDAY,
    DaysInWeekEnum.WEDNESDAY,
    DaysInWeekEnum.THURSDAY,
    DaysInWeekEnum.FRIDAY,
  ],
  [DaysInWeekEnum.MONDAY, DaysInWeekEnum.TUESDAY, DaysInWeekEnum.FRIDAY, DaysInWeekEnum.SATURDAY],
  [DaysInWeekEnum.MONDAY, DaysInWeekEnum.WEDNESDAY, DaysInWeekEnum.FRIDAY, DaysInWeekEnum.SUNDAY],
  [DaysInWeekEnum.SATURDAY, DaysInWeekEnum.SUNDAY],
];

export const DEMO_NUMBER_OF_OPENINGS: number[] = [2, 3, 12, 41, 33, 14, 19, 22];

export const DEMO_SALARIES: number[] = [1000, 1230, 9999, 10000, 800, 450, 3200];

export const CYPRESS_DEMO_ORDER_NAME: string = 'Cypress - Test Job Order';
