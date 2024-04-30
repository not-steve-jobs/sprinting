import {JobOrderAssociateStatus, JobOrderStatus} from 'src/modules/status/status.enum';
import {intGuid} from 'src/seed/utils/seed.utils';
import {DemoUserData} from './utils';
import {getCountryId} from '../users/user/utils';
import {countryData} from 'src/seed/essential/data/country.data';

export const rawData: DemoUserData = {
  user: {
    email: 'roberto.nawrath@yopmail.com',
    id: intGuid(9),
    B2CId: 'db3850da-78b3-4332-af20-514c1ccba5e7',
    firstName: 'Roberto Andres',
    lastName: 'Ampuero Nawrath',
    countryIds: [getCountryId(countryData, 'CHE'), getCountryId(countryData, 'FOC')],
  },
  jobOrders: [
    {
      tenantId: 88,
      jobOrderProps: [
        {
          name: 'Job Order Demo 1',
          orderStatus: JobOrderStatus.PartiallyCovered,
          numberOfOpenings: 5,
          candidates: [
            {
              userId: '58d0bffb-d4a7-4864-a9c7-adb4ecab1952',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: '54e1e8d2-abdf-4171-818a-97bd8eb002a1',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: '03421eed-2ef0-4d29-b9e2-f66d870d37cc',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: 'cf573c96-47c2-4b55-9256-360ff3186780',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: '08880635-8bb2-49e0-b987-9b588cdeea35',
              status: JobOrderAssociateStatus.PreContract,
            },
          ],
        },
        {
          name: 'Job Order Demo 2',
          orderStatus: JobOrderStatus.InProgress,
          numberOfOpenings: 5,
          candidates: [],
        },
        {
          name: 'Job Order Demo 3',
          orderStatus: JobOrderStatus.CandidatesPreselection,
          numberOfOpenings: 5,
          candidates: [
            {
              userId: 'b6a34bd6-0fa9-487e-b4ed-ac46d7251e3b',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: 'a3ab8749-bf79-4ad2-8347-c6fddfe5bf45',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: '0f10172e-2f99-43d2-993d-f48d36c95061',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: 'c4466082-935d-4c98-a1b9-9efb7e31bd02',
              status: JobOrderAssociateStatus.References,
            },
            {
              userId: 'ed13a07d-52c5-4f22-8ccf-2852a7a11f35',
              status: JobOrderAssociateStatus.Offer,
            },
          ],
        },
        {
          name: 'Job Order Demo 4',
          orderStatus: JobOrderStatus.Submitted,
          numberOfOpenings: 5,
          candidates: [],
        },
        {
          name: 'Job Order Demo 5',
          orderStatus: JobOrderStatus.Covered,
          numberOfOpenings: 5,
          candidates: [
            {
              userId: '8935d787-fb8b-4770-8dfb-39b3a6c747a0',
              status: JobOrderAssociateStatus.PreContract,
            },
            {
              userId: '741058f4-bcdb-4456-a209-6e53b0c3d82f',
              status: JobOrderAssociateStatus.PreContract,
            },
            {
              userId: '39b5e889-0a3b-4fa8-8bb9-8bd1a79cba4e',
              status: JobOrderAssociateStatus.PreContract,
            },
            {
              userId: 'f36426e4-48ba-4439-bf7d-15c53ad5f3ef',
              status: JobOrderAssociateStatus.PreContract,
            },
            {
              userId: 'b6dbd027-a48a-4e2c-965e-c0e28957ded7',
              status: JobOrderAssociateStatus.PreContract,
            },
          ],
        },
      ],
    },
    {
      tenantId: 137,
      jobOrderProps: [
        {
          name: 'Job Order Demo 1',
          orderStatus: JobOrderStatus.PartiallyCovered,
          numberOfOpenings: 5,
          candidates: [
            {
              userId: 'dafca385-27b3-4911-bd68-3cd1975086a1',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: '7535d092-d930-4f2a-8094-dddefbc606c4',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: '1cd9a833-31b8-4412-82fb-1d7825a40d5c',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: '833ae47f-3d33-4fcd-9ae7-ac8b3798ee06',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: 'fed161a0-2ffc-4c58-8c4f-3c2ee4ddddf6',
              status: JobOrderAssociateStatus.PreContract,
            },
          ],
        },
        {
          name: 'Job Order Demo 2',
          orderStatus: JobOrderStatus.InProgress,
          numberOfOpenings: 5,
          candidates: [],
        },
        {
          name: 'Job Order Demo 3',
          orderStatus: JobOrderStatus.CandidatesPreselection,
          numberOfOpenings: 5,
          candidates: [
            {
              userId: '05d88a96-7838-4dd1-9cc7-5f3bd037191e',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: '72f8a206-b6e6-42b9-9a1a-e242616aaca2',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: '0e5debc0-beb1-4b1a-988a-2cbf02859e36',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: 'a9c94276-5714-4748-95a8-3125d18973a4',
              status: JobOrderAssociateStatus.References,
            },
            {
              userId: '4a8e2a23-ff84-4d28-9d3f-5e5dd2cb7dbe',
              status: JobOrderAssociateStatus.Offer,
            },
          ],
        },
        {
          name: 'Job Order Demo 4',
          orderStatus: JobOrderStatus.Submitted,
          numberOfOpenings: 5,
          candidates: [],
        },
        {
          name: 'Job Order Demo 5',
          orderStatus: JobOrderStatus.Covered,
          numberOfOpenings: 5,
          candidates: [
            {
              userId: '565b2aee-65ea-4c95-9c7b-83df4634b0f5',
              status: JobOrderAssociateStatus.PreContract,
            },
            {
              userId: '19c5f232-b8a4-4334-90c8-24dede72e376',
              status: JobOrderAssociateStatus.PreContract,
            },
            {
              userId: '4b56f983-afc9-459e-b15a-4bd298f88527',
              status: JobOrderAssociateStatus.PreContract,
            },
            {
              userId: 'c9267729-36b7-494a-bf37-37ec0a06e0cd',
              status: JobOrderAssociateStatus.PreContract,
            },
            {
              userId: 'b6dbd027-a48a-4e2c-965e-c0e28957ded7',
              status: JobOrderAssociateStatus.PreContract,
            },
          ],
        },
      ],
    },
  ],
};
