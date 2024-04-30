import {RedisKeysEnum} from './redis.enum';

export class RedisKey {
  public static singleCandidate(candidateId: string) {
    return `${RedisKeysEnum.Candidate}_${candidateId}`;
  }

  public static tenantUser(tenantId: number, B2CId: string) {
    return `${RedisKeysEnum.TenantUser}_${tenantId}_${B2CId}`;
  }
}
