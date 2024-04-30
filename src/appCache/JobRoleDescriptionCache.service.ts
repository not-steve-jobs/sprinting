import {Injectable} from '@nestjs/common';
import {RedisService} from '../modules/redis/redis.service';

const TTL = 10800;

interface Params {
  countryCode: string;
  brand: string;
  infoSkillCode: string;
  language: string;
}

@Injectable()
export class JobRoleDescriptionCacheService {
  constructor(private redis: RedisService) {}

  private generateKey(params: Params): string {
    return 'JobRoleDescription_'.concat(params.countryCode, params.brand, params.infoSkillCode, params.language);
  }

  public async set(params: Params, data: string[]): Promise<boolean> {
    return await this.redis.setAsync(this.generateKey(params), JSON.stringify(data), TTL);
  }

  public async get(params: Params): Promise<string[]> {
    return await this.redis.getAsyncAs<string[]>(this.generateKey(params));
  }
}
