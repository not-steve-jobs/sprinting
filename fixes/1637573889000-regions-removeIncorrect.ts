import {FixInterface} from 'src/modules/fix/fix.interface';
import {getConnection} from 'typeorm';
import { RegionWageRepository } from 'src/modules/regionWage/regionWage.repository';
import { RegionRepository } from 'src/modules/region/region.repository';

export class RemoveIncorrectRegionsFix1637573889000 implements FixInterface {
  public async execute(): Promise<any> {
    return await getConnection().transaction(async (tManager) => {
      const regionIds = [
        '8f07f942-b564-41ef-8250-6ce3f5bfda6c',
        '00f60a15-2448-46a0-8945-73e81ec21c5f',
        '0d95201d-83a2-4c33-b94c-494e542136b3',
        '9442a4a8-e522-4c64-ad3a-769d78d7e099',
        '26198efb-b305-4e06-931f-1e1a3d511daa',
        'ba35200a-66aa-4435-ace3-5edf89b5a386',
        '813c0df3-4968-41d5-a0a9-04b6616c4c12',
        '63e3e93a-511e-4206-9999-e3641a8491f4',
        'be5f413d-a99e-47f5-a823-6b53c8f16fb6',
      ];

      const regionWageRepository = tManager.getCustomRepository(RegionWageRepository);
      const regionRepository = tManager.getCustomRepository(RegionRepository);

      await regionWageRepository.deleteWageForRegions(regionIds);
      await regionRepository.deleteMultiple(regionIds);
    });
  }
}