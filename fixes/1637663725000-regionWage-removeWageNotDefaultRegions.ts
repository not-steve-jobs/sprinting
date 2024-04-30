import {FixInterface} from 'src/modules/fix/fix.interface';
import {getConnection} from 'typeorm';
import { RegionWageRepository } from 'src/modules/regionWage/regionWage.repository';
import { RegionRepository } from 'src/modules/region/region.repository';

export class RemoveWagesNotDefaultRegions1637663725000 implements FixInterface {
  public async execute(): Promise<any> {
    return await getConnection().transaction(async (tManager) => {
      const tenantIds = [
        88,
        137,
        138,
        178,
        179,
        180
      ];

      const regionWageRepository = tManager.getCustomRepository(RegionWageRepository);
      const regionRepository = tManager.getCustomRepository(RegionRepository);

      for (const tenantId of tenantIds) {
        const regions =  await regionRepository.findAll(tenantId);
        for (const region of regions) {
          if (!region.default) {
            await regionWageRepository.deleteWageForRegions([region.id]);
          }
          else {
            //remove region wage with incorrect tenant
            await tManager.query(`DELETE from "RegionWage" where "regionId" = $1 and "tenantId" != $2`, [region.id, region.tenantId]);
          }
        }

        //remove regionWage duplicates
        await tManager.query(`DELETE from "RegionWage" rw1 USING "RegionWage" rw2 
                    WHERE rw1."id" > rw2."id"
                    AND rw1."regionId" = rw2."regionId"
                    AND rw1."jobRoleId" = rw2."jobRoleId"
                    AND rw1."experienceLevelId" = rw2."experienceLevelId"`);
      }
    });
  }
}