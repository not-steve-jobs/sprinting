import {Injectable} from '@nestjs/common';
import {RegionPostalCodeDto} from './dto/regionPostalCode.dto';
import {RegionPostalCodeRepository} from './regionPostalCode.repository';

@Injectable()
export class RegionPostalCodeService {
  constructor(private readonly repository: RegionPostalCodeRepository) {}

  public async findZipForRegion(regionId: string, zip: string): Promise<RegionPostalCodeDto> {
    return this.repository.findOne(regionId, zip);
  }
}
