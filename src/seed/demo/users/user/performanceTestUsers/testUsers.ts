import {PerformanceTestUserData} from './index';
import {intGuid} from 'src/seed//utils/seed.utils';
import {UUIDSection} from 'src/seed/utils/uuidSection.enum';

// all B2CId-s are connected to IDP test tenant, so login will work in CLP test/k6 environment
export const testUsers: PerformanceTestUserData[] = [
  {
    B2CId: '33fc07b1-82b6-431a-97c2-8c3b0d704d08',
    email: 'perftest01_test@yopmail.com',
    id: intGuid(101, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '36b9ca5c-d821-439a-b606-e3e722823d98',
    email: 'perftest02_test@yopmail.com',
    id: intGuid(102, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '31bb1205-ea84-4a90-a40e-d8b6488f0329',
    email: 'perftest03_test@yopmail.com',
    id: intGuid(103, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'd3b6225c-7b20-4f26-8c34-5b074f6cafea',
    email: 'perftest04_test@yopmail.com',
    id: intGuid(104, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'a98dd474-4d02-4723-91e6-8ff9a880bc69',
    email: 'perftest05_test@yopmail.com',
    id: intGuid(105, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '6415841d-f4d5-499b-a625-31c774e2f3b4',
    email: 'perftest06_test@yopmail.com',
    id: intGuid(106, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '2575fc6d-ae82-4cad-a35a-f72a99b1b68f',
    email: 'perftest07_test@yopmail.com',
    id: intGuid(107, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '2402dd45-4845-479d-bfb2-357ff4d4af1e',
    email: 'perftest08_test@yopmail.com',
    id: intGuid(108, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '0595674e-90d4-4930-b785-86565c38b869',
    email: 'perftest09_test@yopmail.com',
    id: intGuid(109, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'c58f48a1-bd01-4cfa-bc90-73c8891075b7',
    email: 'perftest10_test@yopmail.com',
    id: intGuid(110, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '770c354e-b2e6-4f00-8ae4-9d3d13296b74',
    email: 'perftest11_test@yopmail.com',
    id: intGuid(111, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'fa00275f-c070-4225-be89-166ba15a1311',
    email: 'perftest12_test@yopmail.com',
    id: intGuid(112, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '453a35f2-9d6d-4374-b4db-b773337c7cba',
    email: 'perftest13_test@yopmail.com',
    id: intGuid(113, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '1e1b77a6-42bb-49df-8b29-fad1bb85d8eb',
    email: 'perftest14_test@yopmail.com',
    id: intGuid(114, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '7db73dd2-132b-434b-8860-58ea4eb5da00',
    email: 'perftest15_test@yopmail.com',
    id: intGuid(115, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'e56ee58b-f563-4453-b7c8-562bc3935879',
    email: 'perftest16_test@yopmail.com',
    id: intGuid(116, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '6ef8b192-8d0b-489d-9d6d-e840a58333d4',
    email: 'perftest17_test@yopmail.com',
    id: intGuid(117, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'f0226cb5-0fac-4d32-88ac-5eddde3d82e3',
    email: 'perftest18_test@yopmail.com',
    id: intGuid(118, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'f4489e29-612d-4e1a-8e25-ab1e5f4c8dd9',
    email: 'perftest19_test@yopmail.com',
    id: intGuid(119, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '029a35c8-116e-4786-a2d8-1332adda4a80',
    email: 'perftest20_test@yopmail.com',
    id: intGuid(120, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '650dc509-43e1-4afe-b3d8-ce6e2f5338a7',
    email: 'perftest21_test@yopmail.com',
    id: intGuid(121, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'ab9df96e-1759-421d-a7a1-e6665adbc9b3',
    email: 'perftest22_test@yopmail.com',
    id: intGuid(122, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'a581e60e-ac61-44a3-999a-d3f9018874e4',
    email: 'perftest23_test@yopmail.com',
    id: intGuid(123, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '86ba1b62-aed0-44f4-8771-bccc89201425',
    email: 'perftest24_test@yopmail.com',
    id: intGuid(124, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '18cd4432-3e95-4c5f-8834-2cf3f1e88808',
    email: 'perftest25_test@yopmail.com',
    id: intGuid(125, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '9882f149-d58f-4cef-9afa-36a9f6906ef2',
    email: 'perftest26_test@yopmail.com',
    id: intGuid(126, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'c90216e6-e781-41d1-91f0-40271e28655c',
    email: 'perftest27_test@yopmail.com',
    id: intGuid(127, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '4517cff2-99d7-4e69-ac89-c4aad0094f7d',
    email: 'perftest28_test@yopmail.com',
    id: intGuid(128, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'ded48a2a-4535-4e70-a742-a0d134cec7fb',
    email: 'perftest29_test@yopmail.com',
    id: intGuid(129, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'f09aabef-38d8-46f3-9466-37ee1a7fcbff',
    email: 'perftest30_test@yopmail.com',
    id: intGuid(130, UUIDSection.PerformanceTestUsers),
  },
];
