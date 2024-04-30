import {Injectable} from '@nestjs/common';
import {CaseFollowerRepository} from './caseFollower.repository';
import {CreateCaseFollowerDto} from './dto/createCaseFollower.dto';
import {CaseFollowerDto} from './dto/caseFollower.dto';
import {CaseFollowerError} from './caseFollower.error';
import {CaseFollower} from './caseFollower.entity';
import {NotificationService} from '../notification/notification.service';

@Injectable()
export class CaseFollowerService {
  constructor(
    private readonly caseFollowerRepository: CaseFollowerRepository,
    private readonly notificationService: NotificationService,
  ) {}

  public async create(caseFollower: CreateCaseFollowerDto): Promise<CaseFollowerDto> {
    try {
      const obj = new CaseFollower(caseFollower);
      return this.caseFollowerRepository.save(obj);
    } catch (error) {
      throw new CaseFollowerError.CaseFollowerCreateError(null, error);
    }
  }

  async findByCaseId(tenantId: number, caseId: string): Promise<CaseFollower[]> {
    try {
      return await this.caseFollowerRepository.findByCaseId(caseId);
    } catch (error) {
      throw new CaseFollowerError.CaseFollowerFetchError(null, error);
    }
  }

  async saveMany(caseFollowers: CaseFollower[]): Promise<any> {
    try {
      return await this.caseFollowerRepository.saveMany(caseFollowers);
    } catch (error) {
      throw new CaseFollowerError.CaseFollowerCreateError(null, error);
    }
  }

  async deleteMany(caseFollowers: CaseFollower[]): Promise<any> {
    try {
      return await this.caseFollowerRepository.deleteMany(caseFollowers);
    } catch (error) {
      throw new CaseFollowerError.CaseFollowerDeleteError(null, error);
    }
  }

  async readCase(tenantId: number, caseId: string, userId: string): Promise<any> {
    try {
      const userFollower = await this.caseFollowerRepository.findOneByTenantIdAndUserIdAndCaseId(
        tenantId,
        userId,
        caseId,
      );
      let newCaseFollower;
      if (userFollower && !userFollower.isCaseRead) {
        // eslint-disable-next-line
        const {tenantUser, ...extractedUserFollowerProps} = userFollower;
        newCaseFollower = new CaseFollower({
          ...extractedUserFollowerProps,
          isCaseRead: true,
        });
      } else if (!userFollower) {
        newCaseFollower = new CaseFollower({
          tenantId,
          userId,
          caseId,
          isUserFollower: false,
          isCaseRead: true,
        });
      }
      if (newCaseFollower) {
        await this.create(newCaseFollower);
      }
      await this.notificationService.readCaseNotifications(tenantId, caseId, userId);
      return newCaseFollower;
    } catch (error) {
      throw new CaseFollowerError.CaseFollowerReadUpdateError(null, error);
    }
  }
}
