import {Injectable} from '@nestjs/common';
import {EntityName} from '../common/entityName.interface';
import {LevelEnum} from '../level/level.enum';
import {LevelService} from '../level/level.service';
import {RegionRepository} from '../region/region.repository';
import {GetRegionWageDto} from './dto/getRegionWage.dto';
import {RegionWageDto} from './dto/regionWage.dto';
import {RegionWageRepository} from './regionWage.repository';

@Injectable()
export class RegionWageService {
  constructor(
    private readonly regionRepository: RegionRepository,
    private readonly repository: RegionWageRepository,
    private levelService: LevelService,
  ) {}

  public async getRegionWage(tenantId: number, dto: GetRegionWageDto): Promise<RegionWageDto> {
    const clientDefaultRegion = await this.regionRepository.findDefaultRegion(tenantId);
    const clientWages = await this.repository.findWageForRegionAndJobRole(
      tenantId,
      dto.jobRoleId,
      clientDefaultRegion.id,
    );
    let selectedWage = null;
    clientWages.forEach(async (wage) => {
      if (wage.experienceLevelId == dto.experienceLevelId) {
        selectedWage = wage;
        return;
      }
    });

    if (clientWages.length && !selectedWage) {
      const level = await this.levelService.getLevelByNameAndEntity(EntityName.Experience, LevelEnum.Level3);
      //if no wage for current experience level then return the higher one
      if (level) {
        selectedWage = clientWages.find((wage) => wage.experienceLevelId === level.id);
      }
    }

    return selectedWage;
  }
}
