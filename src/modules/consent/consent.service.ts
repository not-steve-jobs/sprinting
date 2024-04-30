import {Injectable} from '@nestjs/common';
import {ConsentCacheService} from 'src/appCache/consentCache.service';
import {ConsentRepository} from './consent.repository';
import {ConsentType} from './consentType.enum';
import {ConsentDto} from './dto/consent.dto';

@Injectable()
export class ConsentService {
  constructor(private readonly consentRepository: ConsentRepository, private readonly cache: ConsentCacheService) {}

  public async getLatestByType(tenantId: number, type: ConsentType, isMandatory: boolean): Promise<ConsentDto> {
    let result = this.cache.getByTenantTypeAndIsMandatory(tenantId, type, isMandatory);
    if (result) {
      return result;
    }

    result = await this.consentRepository.findLastByType(tenantId, type, isMandatory);
    this.cache.setByTenantTypeAndIsMandatory(tenantId, type, isMandatory, result);
    return result;
  }
}
