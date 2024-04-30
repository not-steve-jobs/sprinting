import {Injectable} from '@nestjs/common';
import * as dateFns from 'date-fns';
import {UserConsentRepository} from './userConsent.repository';
import {UserConsentDto} from './dto/userConsent.dto';
import {UserConsent} from './userConsent.entity';
import {ConsentService} from '../consent/consent.service';
import {ConsentDto} from '../consent/dto/consent.dto';
import {ConsentType} from '../consent/consentType.enum';
import {UserConsentServiceErrors} from './userConsent.error';
import {UserMarketingConsentDto} from './dto/userMarketingConsent.dto';
import {TenantUser} from '../tenantUser/tenantUser.entity';

@Injectable()
export class UserConsentService {
  constructor(
    private readonly userConsentRepository: UserConsentRepository,
    private readonly consentService: ConsentService,
  ) {}

  async get(userId: string): Promise<UserConsentDto> {
    return this.userConsentRepository.findOne(userId);
  }
  async getAll(userId: string): Promise<UserConsentDto[]> {
    return this.userConsentRepository.getAllWithConsent(userId);
  }

  public async create(tenantId: number, userId: string, signedConsents: ConsentDto[]): Promise<ConsentDto[]> {
    try {
      const promise = signedConsents.map(async (signedConsent) => {
        const userConsent = new UserConsent({
          tenantId,
          userId,
          consentId: signedConsent.id,
        });
        await this.userConsentRepository.save(userConsent);
      });
      await Promise.all(promise);
      return this.check(tenantId, userId);
    } catch (err) {
      throw new UserConsentServiceErrors.UserConsentCreateError({message: 'Error creating user consents'});
    }
  }

  public async check(tenantId: number, userId: string): Promise<ConsentDto[]> {
    const unsignedConsents = [];

    const promise = Object.values(ConsentType).map(async (consentType) => {
      const activeConsent = await this.consentService.getLatestByType(tenantId, consentType, true);
      if (activeConsent) {
        const userSignedConsent = await this.userConsentRepository.findLastOne(tenantId, userId, consentType);
        if (userSignedConsent) {
          const validFrom = dateFns.parseISO(String(activeConsent.validFrom));
          if (dateFns.isAfter(validFrom, activeConsent.createdAt)) {
            unsignedConsents.push(activeConsent);
          }
        } else {
          unsignedConsents.push(activeConsent);
        }
      }
    });
    await Promise.all(promise);
    return unsignedConsents;
  }

  public async getMarketing(tenantId: number, userId: string): Promise<boolean> {
    let isAccepted = false;

    const marketingConsent = await this.consentService.getLatestByType(tenantId, ConsentType.MARKETING, false);

    if (marketingConsent) {
      const userMarketingConsent = await this.userConsentRepository.findLastOne(
        tenantId,
        userId,
        ConsentType.MARKETING,
      );

      if (userMarketingConsent) isAccepted = userMarketingConsent.isAccepted;
    }

    return isAccepted;
  }

  public async setMarketing(tenantId: number, userId: string, payload: UserMarketingConsentDto): Promise<boolean> {
    let isAccepted = false;

    const marketingConsent = await this.consentService.getLatestByType(tenantId, ConsentType.MARKETING, false);

    if (marketingConsent) {
      const userMarketingConsent = new UserConsent();
      userMarketingConsent.tenantId = tenantId;
      userMarketingConsent.userId = userId;
      userMarketingConsent.consentId = marketingConsent.id;
      userMarketingConsent.isAccepted = payload.isAccepted;
      await this.userConsentRepository.save(userMarketingConsent);
      isAccepted = userMarketingConsent.isAccepted;
    }

    return isAccepted;
  }

  /**
   * Accept the latest available versions for the user consents
   * This method is triggered automatically after successful user registration and accepts the Terms and Privacy consents
   *
   * @param {TenantUser} tenantUser - The user for which should be accepted the latest version of the consents
   * @returns {Promise<void>}
   */
  public async acceptLatestUserConsent(tenantUser: TenantUser): Promise<void> {
    const unsignedConsents = await this.check(tenantUser.tenantId, tenantUser.userId);
    await this.create(tenantUser.tenantId, tenantUser.userId, unsignedConsents);
  }
}
