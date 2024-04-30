import {Injectable} from '@nestjs/common';
import {NetPromoteScoreRepository} from './netPromoteScore.repository';
import {NetPromoteScore} from './netPromoteScore.entity';
import {NetPromoteScoreDto} from './dto/netPromoteScore.dto';
import {CreateNetPromoteScoreDto} from './dto/createNetPromoteScore.dto';
import {NetPromoteScoreError} from './netPromoteScore.error';

@Injectable()
export class NetPromoteScoreService {
  constructor(private readonly netPromoteScoreRepository: NetPromoteScoreRepository) {}

  async create(tenantId: number, userId: string, npsData: CreateNetPromoteScoreDto): Promise<NetPromoteScoreDto> {
    try {
      const nps = new NetPromoteScore(npsData);
      nps.tenantId = tenantId;
      nps.userId = userId;
      return await this.netPromoteScoreRepository.save(nps);
    } catch (error) {
      throw new NetPromoteScoreError.NetPromoteScoreCreateError(null, error);
    }
  }
}
