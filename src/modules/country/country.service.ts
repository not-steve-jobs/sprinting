import {Country} from 'src/modules/country/country.entity';
import {CountryRepository} from 'src/modules/country/country.repository';
import {Injectable} from '@nestjs/common';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  public async findOne(countryId: string): Promise<Country> {
    return this.countryRepository.findOne(countryId);
  }

  public async findOneByCallingCode(callingCode: string): Promise<Country> {
    return this.countryRepository.findOneByCallingCode(callingCode);
  }

  public async findOneByCode(countryCode: string): Promise<Country> {
    return this.countryRepository.findOneByCode(countryCode);
  }
}
