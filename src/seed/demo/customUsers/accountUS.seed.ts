import {JobOrderAssociateStatus, JobOrderStatus} from 'src/modules/status/status.enum';
import {intGuid} from 'src/seed/utils/seed.utils';
import {DemoUserData} from './utils';
import {getCountryId} from '../users/user/utils';
import {countryData} from 'src/seed/essential/data/country.data';

export const rawData: DemoUserData = {
  user: {
    email: 'demo.us.account@yopmail.com',
    id: intGuid(14),
    B2CId: '7f1c3b00-09c5-442e-8c0c-bd6bcbb71942',
    firstName: 'Demo US',
    lastName: 'Account',
    countryIds: [getCountryId(countryData, 'USA')],
  },
  jobOrders: [
    {
      tenantId: 101,
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
        {
          name: 'Job Order Demo 6',
          orderStatus: JobOrderStatus.CanceledByTheClient,
          numberOfOpenings: 5,
          candidates: [
            {
              userId: 'c2ce00fc-0a8d-411e-a996-baa6c0e2d23c',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: '809e5e81-075e-4a53-807c-61c203abd799',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: '7805e1f9-7b5d-411c-8612-1a5229545ead',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: '6db98230-5052-429f-b596-8a98ee3f7e1e',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: '13fc63cd-8919-4634-b298-9cd1ee50ecc6',
              status: JobOrderAssociateStatus.SendOut,
            },
          ],
        },
        {
          name: 'Job Order Demo 7',
          orderStatus: JobOrderStatus.CancelledByAdecco,
          numberOfOpenings: 5,
          candidates: [
            {
              userId: 'c0e6b635-05f7-4420-bfeb-75051b37ac0e',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: 'c983473b-3177-4ce1-88c4-3b80b3196418',
              status: JobOrderAssociateStatus.Submittal,
            },
            {
              userId: '0d3cdf28-42f7-4b30-aa3c-064dccc1aec5',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: '8bc150d7-cf57-47d4-9c3c-df92943f741b',
              status: JobOrderAssociateStatus.SendOut,
            },
            {
              userId: '98c2cc36-a072-4c2c-9d1c-8f176cc1184c',
              status: JobOrderAssociateStatus.Offer,
            },
          ],
        },
      ],
    },
  ],
};
