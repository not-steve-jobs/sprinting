import {PerformanceTestUserData} from './index';
import {intGuid} from 'src/seed/utils/seed.utils';
import {UUIDSection} from 'src/seed/utils/uuidSection.enum';

// all B2CId-s are connected to IDP dev tenant, so login will work in CLP dev environment
export const devUsers: PerformanceTestUserData[] = [
  {
    B2CId: '00c76d73-1366-478d-a1b1-a29a9c82f647',
    email: 'perftest01@yopmail.com',
    id: intGuid(101, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '77d92768-6c9a-48f4-add4-b864d08f6a8f',
    email: 'perftest02@yopmail.com',
    id: intGuid(102, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '0da8a66b-af62-4942-9b5e-35814f36f207',
    email: 'perftest03@yopmail.com',
    id: intGuid(103, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '7ec315d9-ce66-4250-8529-1a52d4240460',
    email: 'perftest04@yopmail.com',
    id: intGuid(104, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'cb5f9863-260e-4af1-9e52-c94f574e7c79',
    email: 'perftest05@yopmail.com',
    id: intGuid(105, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'ca9fa7c1-596b-43ec-8fea-d79ad7bafaaa',
    email: 'perftest06@yopmail.com',
    id: intGuid(106, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '296febe5-1e30-410b-82db-cbd0cfd4f1ef',
    email: 'perftest07@yopmail.com',
    id: intGuid(107, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '676b5df8-0a2a-4939-927a-9aea565595cd',
    email: 'perftest08@yopmail.com',
    id: intGuid(108, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '33ca408e-bb63-4b4a-97cc-2272011428a2',
    email: 'perftest09@yopmail.com',
    id: intGuid(109, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'dfd8f29f-492b-44f4-b824-17b8a5781c5a',
    email: 'perftest10@yopmail.com',
    id: intGuid(110, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '3fc67a64-4491-4483-84bb-ff6a3994dc2f',
    email: 'perftest11@yopmail.com',
    id: intGuid(111, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'cba47530-2f72-4105-9ce7-5505307030d8',
    email: 'perftest12@yopmail.com',
    id: intGuid(112, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'dd4587fb-9602-4208-83f0-828140e885e8',
    email: 'perftest13@yopmail.com',
    id: intGuid(113, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '45133d12-27d9-4596-bfda-005a01294374',
    email: 'perftest14@yopmail.com',
    id: intGuid(114, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '42d385f8-4db5-47cc-b3fa-3ba2bbb924db',
    email: 'perftest15@yopmail.com',
    id: intGuid(115, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'f8583d0a-4daf-4f7a-b360-45c83451f414',
    email: 'perftest16@yopmail.com',
    id: intGuid(116, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'e434b850-8b2b-43a3-bae2-85b8cd867367',
    email: 'perftest17@yopmail.com',
    id: intGuid(117, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '870756a6-274f-4cc5-9a87-1bdb90c0c8f0',
    email: 'perftest18@yopmail.com',
    id: intGuid(118, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'b59e2860-3223-4a0c-8777-f8ae57919305',
    email: 'perftest19@yopmail.com',
    id: intGuid(119, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '31fbd7be-d5c7-4258-aea2-7de0588f1643',
    email: 'perftest20@yopmail.com',
    id: intGuid(120, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'f917d5dc-fc44-46c1-b72f-9230ccfa7e3c',
    email: 'perftest21@yopmail.com',
    id: intGuid(121, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '87956175-8697-4705-bc81-fc21c8f1b79d',
    email: 'perftest22@yopmail.com',
    id: intGuid(122, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '29eead72-6a93-4b20-b42a-6329dedd5087',
    email: 'perftest23@yopmail.com',
    id: intGuid(123, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '03dfde39-5b85-489c-b9f9-214014b9e658',
    email: 'perftest24@yopmail.com',
    id: intGuid(124, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'c9f494b5-4402-4099-87a5-a9c1fd9f176b',
    email: 'perftest25@yopmail.com',
    id: intGuid(125, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'c5f4ccce-3a13-430a-b6b8-fce25357c0bd',
    email: 'perftest26@yopmail.com',
    id: intGuid(126, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'bcda7d16-77d2-4282-b57c-a0c3b1ee6b53',
    email: 'perftest27@yopmail.com',
    id: intGuid(127, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '6e6f123b-62e3-4a12-af29-636c01e2e4d2',
    email: 'perftest28@yopmail.com',
    id: intGuid(128, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: '3d5fc445-4a05-4b25-be07-1ecae1f4526d',
    email: 'perftest29@yopmail.com',
    id: intGuid(129, UUIDSection.PerformanceTestUsers),
  },
  {
    B2CId: 'cf7780cd-7ea8-45ef-870d-dd195601a0d7',
    email: 'perftest30@yopmail.com',
    id: intGuid(130, UUIDSection.PerformanceTestUsers),
  },
];
