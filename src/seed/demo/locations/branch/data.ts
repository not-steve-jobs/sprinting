/**
 * List with demo data used to generate "random" seeds
 */

import {BranchEnum} from 'src/modules/branch/branch.enum';
import {BranchDto} from 'src/modules/branch/dto/branch.dto';

export const DEMO_BRANCH_STATUSES: string[] = Object.values(BranchEnum);

// Note: We want to seed some static defined Branches because there are some tests on INT env and they may depend on those items
export const STATIC_BRANCHES: BranchDto[] = [
  {
    id: '89cc2f76-470a-9477-ffee-63ae4bfc5594',
    tenantId: 88,
    status: 'open',
    name: 'Adecco Afganistan',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ca1ebbe1-2bd7-4fe0-2ab7-f605b1be2fd6',
    tenantId: 88,
    status: 'open',
    name: 'Adecco Afghanistan 25.10.21',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7c1a7aa5-a479-10f7-81a6-1491dcc9a5c0',
    tenantId: 88,
    status: 'open',
    name: 'Adecco Afghanistan Office',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '83856cb9-f018-cfde-fcc0-78ac16502075',
    tenantId: 88,
    status: 'open',
    name: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7bf7a8e3-481e-8fae-9bef-5b5080d00b8f',
    tenantId: 88,
    status: 'open',
    name: 'MY FIRST BRANCH',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '09c3c3e6-af7c-8c04-1c2a-71885311c2ad',
    tenantId: 88,
    status: 'open',
    name: 'AFG Office',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'f478fdf4-4873-8898-f33a-5b171170a49e',
    tenantId: 88,
    status: 'open',
    name: 'sanity_23',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'e1df5b72-d8f9-d9e6-07b1-859711861a7d',
    tenantId: 88,
    status: 'open',
    name: 'New Branch',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '0ce46e26-3822-8ea2-a4ae-3895e734c193',
    tenantId: 88,
    status: 'open',
    name: 'test fg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '415794f8-6492-21fc-7fb8-18dcfb3dccff',
    tenantId: 88,
    status: 'open',
    name: 'Adecco Afganistan 02.11.21',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '870cc669-d725-a78d-0df0-3edae6374f94',
    tenantId: 88,
    status: 'open',
    name: 'Adecco Afghanistan Office',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '89b14ae6-803d-8914-4987-ee10f3a6aa4e',
    tenantId: 88,
    status: 'open',
    name: 'Adecco Afganistan 17.11.21',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'edaeeac4-4586-e22e-ac00-b7338e4d0260',
    tenantId: 88,
    status: 'open',
    name: 'Adecco Afganistan',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ef0b9664-dc5e-64e9-8b97-df4902abe9f2',
    tenantId: 88,
    status: 'open',
    name: 'Adecco Afganistan 29.10.21',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
