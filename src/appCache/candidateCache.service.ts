import {Injectable} from '@nestjs/common';
import {CandidateDto} from 'src/modules/aamBackend/dto/candidate.dto';
import {RedisExpirationTime, RedisKeysEnum} from 'src/modules/redis/redis.enum';
import {RedisService} from 'src/modules/redis/redis.service';
import {RedisKey} from 'src/modules/redis/redisKey';

/**
 * Service providing an interface to manage the candidate cache.
 */
@Injectable()
export class CandidateCacheService {
  constructor(private redis: RedisService) {}

  /**
   * Retrieves a candidate from the Redis store, if it exists.
   *
   * @param candidateId Id of the candidate/associate
   * @returns (in Promise) `CandidateDto` if found; `null` if not
   */
  public async get(candidateId: string): Promise<CandidateDto | null> {
    return await this.redis.getAsyncAs<CandidateDto>(RedisKey.singleCandidate(candidateId));
  }

  /**
   * Retrieves all candidates from the Redis store.
   *
   * @returns (in Promise) Array of found `CandidateDto`s.
   */
  public async getAll(): Promise<CandidateDto[]> {
    return await this.redis.getMultiAs<CandidateDto>(RedisKeysEnum.Candidate);
  }

  /**
   * Stores a candidate in the Redis cache.
   *
   * @param candidate Candidate data
   * @param ttl Expiration time in seconds.
   * @returns true if succeeded, false if errored.
   */
  public async set(candidate: CandidateDto, ttl: number = RedisExpirationTime.Candidate): Promise<boolean> {
    return await this.redis.setAsync(RedisKey.singleCandidate(candidate.id), JSON.stringify(candidate), ttl);
  }

  /**
   * Invalidates (deletes) a candidate entry from the Redis cache.
   *
   * @param candidateId Id of the candidate/associate
   */
  public async invalidate(candidateId: string): Promise<void> {
    return await this.redis.delAsync(RedisKey.singleCandidate(candidateId));
  }
}
