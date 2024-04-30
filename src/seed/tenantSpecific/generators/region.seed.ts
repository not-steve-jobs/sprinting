import {PlainObject} from '../../../modules/common/common.dto';
import {
  adeccoGroupSwi,
  adeccoSwi,
  badenochAndClarkSwi,
  focore,
  lhhSwi,
  pontoonSwi,
  springProSwi,
} from '../data/tenant.data';

export enum RegionsEnum {
  High = 'High',
  Middle = 'Middle',
  Low = 'Low',
  CantonGE = 'Canton GE',
  Focore = 'Focore',
}

const regionUuids = [
  '21fbb36e-ab7d-40c8-b041-faf3c2887a00',
  '9061da05-3c81-4d5f-9197-1a541e93d092',
  'd8530b63-e927-4f6d-8238-09150ed5d33d',
  '747ad4e2-a983-4a05-8f5c-6cc2d9d08cf8',
  '47252b06-8721-41fd-bb08-a5ccf99eb769',
  '5a95ecdc-330d-4d91-981f-6c1428613d4d',
  'b99ccbed-d19d-4ac1-bb64-d1ec986eb550',
  'e0687346-4eb0-4633-a512-0a7c41deaf6b',
  '5330b7a5-b567-42b1-b8dd-50b234572c05',
  '1d37ec29-5d79-4bf1-b19b-47cd2da2eda5',
  '9f4474ef-29a2-418e-bf68-6c7b7396e21a',
  '7d4d110a-74d0-44de-ba06-ed595786721e',
  '3af5d283-734f-448e-80b1-798421fd34eb',
  '37c296bd-0fd4-4d81-bec9-7f93de5d66d4',
  'da6baf7a-50c7-41a5-9c5c-87c9adf4be60',
  'c488c953-748b-4426-85d2-102eca7827de',
  '29aaa03b-2073-4073-bfab-a151371b4f1d',
  '02ac549b-ed1d-406a-a408-006eeeb38a43',
  '3ca4feca-7075-4fd3-a4bf-374d163c1b11',
  '178b0aeb-8baf-4c66-87f4-de0540298305',
  '015e2b44-1bf8-4ef6-9aa8-ed8a77884314',
  '815e3a9b-b137-408b-8736-c6395de3cdaf',
  'a8f7233f-5ea5-4216-ae4f-46b18e9414e0',
  '1db9d8bf-ae16-4134-8907-c85accde4a08',
  'e511ad41-9d47-4f76-b056-69a7fa5bab7c',
  'dd4568ed-be7c-4c98-a0f9-ad16375f4a07',
  '6ba64044-2b41-4cab-877f-74f476799610',
  'eeab336c-a5a1-443b-8c17-b8509155d7d7',
  '290e58ba-a81c-4fff-9cb3-da5d7e40e9bf',
  'e1db1abc-c7c2-4720-bef8-e76853cdb0fe',
  '1b124a6c-dd57-417f-b18a-4292fb382f92',
  'b6230a89-d1d0-4118-89e7-b7a28bd04397',
  'b9fbb992-ac0c-4d14-beb1-c59281eb7530',
  'e64f094a-78fc-48b3-acfe-84fe3edc00df',
  '446c785a-4b8a-49a7-ae33-7a5c61fe2199',
  'cf0d58f5-ca92-4d01-ac72-9660aea268fa',
  'e5fd9f30-6442-4370-bcd4-b9ecbb90364f',
  '80d1ddf6-f794-471f-a908-3bda826f2241',
  'b8326e54-caa8-4b1b-942e-c45fcd2525fa',
  'f1ba1a2c-d362-4613-ac63-77354f9748f1',
  '4bc44883-950d-457f-bae6-c0b51f2db72d',
  '0f236316-ffe2-4410-9363-f64996edbcc1',
  'e682211c-43e1-4822-b140-ee8cfeaab888',
  '32711e60-df88-4361-b4a2-82252bf9b000',
  '7e8a415e-43e9-4abc-8450-f732590f29ec',
  '0136bcbf-4286-4941-a467-f6b483bbfe48',
  '98f2fa71-c0eb-4f80-a880-ac89f965aa2f',
  '411b665a-5932-4dee-b401-22f78b0500fd',
  '6628e14d-aaeb-43fb-8aa0-bd24e277f1a5',
  'ddb009e4-3db3-4a79-aa01-acae0a1802ba',
  '90222704-a37c-4f40-9ab2-39fe05bb99b1',
  '17c8047b-d569-4e97-ad65-a41f6b020a37',
  'a0758840-3560-4d29-ad42-e9a8cac45d24',
  'eaef9421-a3bd-4dac-9ede-1043bac4b8d2',
  'a4a7d5ce-9cae-45f9-b50e-e8fbb9e841c8',
  '77f23f93-1f85-4ab0-b16d-0324cdd21d9b',
  '64410118-ee26-455e-9ac4-ea88a0968662',
  'da385ec1-af3a-4c2e-bbb3-1b520140415d',
  '9b95110a-2af2-49af-a78b-baf9202934e5',
  'b53c4efd-c53a-4f1e-abf5-8db7204c8994',
  '22d29720-6775-47e5-9ce2-b04152f50358',
  'b70f18ff-6617-48c1-a877-36d8112c820e',
  'dbd89e7b-709c-4f4e-965f-b5447000a507',
  'ebc7863f-da2b-4a6d-a4c7-99a892aab6c2',
  '0c03c706-c21a-45a7-afdd-0a14c0c97679',
  'a2a248fd-616a-473c-b719-a036e96eb262',
  'c75b4cfe-cd42-44c0-8d09-b185fd0a2633',
  'd952f168-faf7-4969-8aa2-4a91c731ed82',
  '4f8e4127-f4e4-4971-987f-65f60df08752',
  'c2e54d01-8bee-4b42-baec-575a26c53462',
  'c1a549d3-4e3d-4c96-a3c1-d9a31a1c997d',
  '6d95f50c-f31c-4ef5-9ac5-acafb5a4a582',
  '742e4faf-6035-4db3-8b39-f12b5cea5414',
  'fb28ac95-7c6d-44a0-a591-86e9ca232e89',
  'f88a6bd7-2f26-412d-a9ca-a792f4cc1ffd',
  '2f9b9f1b-3347-4e9e-8e82-f010ed8f66f1',
  'a6b36a72-0129-4c16-b58a-f11bbbd54491',
  '11f95231-77fa-4dd5-8570-fcc74a02d2fd',
  'bb6d9c11-d2a2-4bc5-83fc-fbcdec13bfbf',
  '00d9748d-4e35-410f-8d7d-6931cb66edc2',
  '8ba1e94a-9b8c-4ddd-afee-7c5d0cdea54f',
  '1172994e-da04-41bc-a2cb-30bd0b40138b',
  'dd7ae908-a6b3-4091-b50e-a97f383803d0',
  '55feb9e6-c7bd-4358-86ed-94f3939c6715',
  '40a46fa0-f8f1-43d5-bfaf-971a685500f7',
  '68c5f838-5924-4356-beef-acabff34166c',
  'cbcc123f-d7da-4944-9ec0-29de5a07045a',
  '40edc4b5-3667-4035-a1e5-81b884581245',
  '717e7ca9-956a-4230-bae3-e233d9e13696',
  'bbec69ac-1bda-4ba4-8aba-0a6060dd1d2b',
  'a7d813ed-d1f2-475e-b231-9f37248f8957',
];

let regionUuidIndex = 0;

export const swiTenants = [
  adeccoSwi.id, //137
  adeccoGroupSwi.id, // 138
  badenochAndClarkSwi.id, //178
  pontoonSwi.id, //179
  springProSwi.id, //180
  lhhSwi.id, //221
];

export const generateRegionData = (): PlainObject[] => {
  const regionData: PlainObject[] = [];
  const fillRegionData = (tenantId, defaultRegion: RegionsEnum, regions: RegionsEnum[]) => {
    for (const region of regions) {
      regionData.push({
        id: regionUuids[regionUuidIndex],
        tenantId: tenantId,
        name: region,
        default: region == defaultRegion,
        regionEntry: region,
      });
      regionUuidIndex++;
    }
  };

  // Seed swiss regions
  for (const tenant in swiTenants) {
    const tenantId = swiTenants[tenant];
    fillRegionData(tenantId, RegionsEnum.High, [
      RegionsEnum.High,
      RegionsEnum.Middle,
      RegionsEnum.Low,
      RegionsEnum.CantonGE,
    ]);
  }

  //Seed Focore region
  fillRegionData(focore.id, RegionsEnum.Focore, [RegionsEnum.Focore]);

  return regionData;
};
