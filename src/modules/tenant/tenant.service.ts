import {Injectable} from '@nestjs/common';
import {CountryService} from '../country/country.service';
import {Tenant} from './tenant.entity';
import {TenantError} from './tenant.error';
import {TenantRepository} from './tenant.repository';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository, private readonly countryService: CountryService) {}

  public async getAll(): Promise<Tenant[]> {
    return this.tenantRepository.findAll();
  }

  public async findAllByCountryId(countryId: string): Promise<Tenant[]> {
    return this.tenantRepository.findAllByCountryId(countryId);
  }

  public async exists(id: number): Promise<boolean> {
    try {
      return await this.tenantRepository.exists(id);
    } catch (e) {
      throw new TenantError.TenantServiceExistsError(null, e);
    }
  }

  public async findOne(tenantId: number): Promise<Tenant> {
    try {
      return await this.tenantRepository.findOne(tenantId);
    } catch (error) {
      throw new TenantError.TenantServiceRetrieveError(null, error);
    }
  }

  public async findOneWithRelations(tenantId: number): Promise<Tenant> {
    try {
      return await this.tenantRepository.findOneWithRelations(tenantId);
    } catch (error) {
      throw new TenantError.TenantServiceRetrieveError(null, error);
    }
  }

  public async getByBrandAndCountry(brand: string, countryCode: string) {
    try {
      const country = await this.countryService.findOneByCode(countryCode);

      if (!country) {
        throw new TenantError.TenantServiceRetrieveError({message: 'Tenant Country not exists'});
      }

      return await this.tenantRepository.findOneByBrandAndCountry(brand, country.id);
    } catch (e) {
      throw new TenantError.TenantServiceRetrieveError(null, e);
    }
  }
}
