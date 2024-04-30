import {countryData} from 'src/seed/essential/data/country.data';
import {UserData, UserDataDefault} from '../data';
import {getCountryId} from '../utils';
import {devUsers} from './devUsers';
import {testUsers} from './testUsers';

const defaultTestUserData: {firstName: string; lastName: string; countryId: string} = {
  firstName: 'Melodie',
  lastName: 'King',
  countryId: getCountryId(countryData, 'CHE'),
};

export interface PerformanceTestUserData {
  id: string;
  B2CId: string;
  email: string;
}

const performanceTestUsers = ['a', 'd'].includes(process.env.ENV_PREFIX) ? devUsers : testUsers;

export const getPerformanceTestUsers = (defaultData: UserDataDefault): UserData[] => {
  return performanceTestUsers.map((user: PerformanceTestUserData) => {
    return {...defaultData, ...defaultTestUserData, ...user};
  });
};
