import {Injectable} from '@nestjs/common';
import {DisableReason} from './disableReason.entity';
import {DisableReasonRepository} from './disableReason.repository';

@Injectable()
export class DisableReasonService {
  constructor(private readonly disableReasonRepository: DisableReasonRepository) {}

  public async findOneByReason(reason: string): Promise<DisableReason> {
    return this.disableReasonRepository.findOneByReason(reason);
  }
}
