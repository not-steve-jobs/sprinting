import {EntityName} from '../../../modules/common/entityName.interface';
import {JobRoleRepository} from 'src/modules/jobRole/jobRole.repository';
import {LevelRepository} from 'src/modules/level/level.repository';
import {RegionRepository} from 'src/modules/region/region.repository';
import {PlainObject} from '../../../modules/common/common.dto';
import {RegionsEnum, swiTenants} from './region.seed';
import {focore} from '../data/tenant.data';

export enum SwiJobRolesEnum {
  Driver = 'Driver',
  Bartender = 'Bartender',
  Assistant = 'Assistant',
  Waiter = 'Waiter',
  Housekeeper = 'Housekeeper',
  // For tenant 137
  Cleaner = 'Cleaner',
  Car_Mechanic = 'Car Mechanic',
  Loader_Unloader = 'Loader Unloader',
  Forklift_Truck_Driver = 'Forklift Truck Driver',
  Employee_Back_Office = 'Employee Back Office',
  Electrical_Engineer = 'Electrical Engineer',
}

export enum ExpirienceLevelsIdEnum {
  Level1 = 9, //<1 years
  Level2 = 10, // 1-2 years
  Level3 = 11, //2-5 years
}

const regionWageDataTemplate = [
  {
    regionType: RegionsEnum.High,
    data: [
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Driver],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Assistant],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Bartender],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Housekeeper],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Waiter],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },

      {
        jobRole: SwiJobRolesEnum.Cleaner,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 22.76,
            suggested: 26.17,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 23.07,
            suggested: 26.53,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 23.42,
            suggested: 26.93,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Car_Mechanic,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.61,
            suggested: 29.45,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 25.61,
            suggested: 29.45,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 27.73,
            suggested: 31.89,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Loader_Unloader,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 20.48,
            suggested: 23.55,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 22.2,
            suggested: 25.53,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 22.66,
            suggested: 26.06,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Forklift_Truck_Driver,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 32.67,
            suggested: 37.57,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 32.67,
            suggested: 37.57,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 36.59,
            suggested: 42.08,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Employee_Back_Office,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 27.93,
            suggested: 35.68,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.93,
            suggested: 32.12,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.03,
            suggested: 35.68,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Electrical_Engineer,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 30.95,
            suggested: 35.59,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 30.95,
            suggested: 35.59,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 33.95,
            suggested: 39.04,
          },
        ],
      },
    ],
  },
  {
    regionType: RegionsEnum.Focore,
    data: [
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Driver],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Assistant],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Bartender],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Housekeeper],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum[SwiJobRolesEnum.Waiter],
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.45,
            suggested: 26.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.88,
            suggested: 28.5,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.68,
            suggested: 33.5,
          },
        ],
      },

      {
        jobRole: SwiJobRolesEnum.Cleaner,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 22.76,
            suggested: 26.17,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 23.07,
            suggested: 26.53,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 23.42,
            suggested: 26.93,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Car_Mechanic,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 25.61,
            suggested: 29.45,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 25.61,
            suggested: 29.45,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 27.73,
            suggested: 31.89,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Loader_Unloader,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 20.48,
            suggested: 23.55,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 22.2,
            suggested: 25.53,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 22.66,
            suggested: 26.06,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Forklift_Truck_Driver,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 32.67,
            suggested: 37.57,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 32.67,
            suggested: 37.57,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 36.59,
            suggested: 42.08,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Employee_Back_Office,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 27.93,
            suggested: 35.68,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 27.93,
            suggested: 32.12,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 31.03,
            suggested: 35.68,
          },
        ],
      },
      {
        jobRole: SwiJobRolesEnum.Electrical_Engineer,
        data: [
          {
            level: ExpirienceLevelsIdEnum.Level1,
            minimum: 30.95,
            suggested: 35.59,
          },
          {
            level: ExpirienceLevelsIdEnum.Level2,
            minimum: 30.95,
            suggested: 35.59,
          },
          {
            level: ExpirienceLevelsIdEnum.Level3,
            minimum: 33.95,
            suggested: 39.04,
          },
        ],
      },
    ],
  },
];

export const generateRegionWageData = async (
  regionRepository: RegionRepository,
  jobRoleRepository: JobRoleRepository,
  levelRepository: LevelRepository,
): Promise<PlainObject[]> => {
  const regionWageData: PlainObject[] = [];
  const fillRegionWageData = async (tenantId: number) => {
    for (const dataByRegionIndex in regionWageDataTemplate) {
      const dataByRegion = regionWageDataTemplate[dataByRegionIndex];
      const region = await regionRepository.findByName(tenantId, dataByRegion.regionType);
      if (!region) continue;
      for (const dataByJobRoleIndex in dataByRegion.data) {
        const dataByJobRole = dataByRegion.data[dataByJobRoleIndex];
        const jobRole = await jobRoleRepository.findOneByName(tenantId, dataByJobRole.jobRole);
        if (jobRole) {
          for (const wageInfoIndex in dataByJobRole.data) {
            const wageInfo = dataByJobRole.data[wageInfoIndex];
            const level = await levelRepository.findOne(wageInfo.level, EntityName.Experience);
            regionWageData.push({
              tenantId: tenantId,
              regionId: region.id,
              jobRoleId: jobRole.id,
              minimum: wageInfo.minimum,
              suggested: wageInfo.suggested,
              experienceLevelId: level.id,
            });
          }
        }
      }
    }
  };
  for (const tenantIndex in swiTenants) {
    const tenantId = swiTenants[tenantIndex];
    await fillRegionWageData(tenantId);
  }
  await fillRegionWageData(focore.id);
  return regionWageData;
};
