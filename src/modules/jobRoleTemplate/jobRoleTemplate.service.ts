import {Injectable} from '@nestjs/common';
import {JobRoleTemplateRepository} from './jobRoleTemplate.repository';
import {JobRoleTemplate} from './jobRoleTemplate.entity';
import {AppConfigService} from '../../core/config/appConfig.service';
import {LanguageService} from '../language/language.service';
import {SharedErrors} from '../../core/error/shared.error';
import {UserProfileService} from '../userProfile/userProfile.service';
import {TenantService} from '../tenant/tenant.service';
import {CountryService} from '../country/country.service';
import {JobRoleService} from '../jobRole/jobRole.service';
import {Logger} from 'src/core/logger';
import {CustomHttpService} from '../customHttp/customHttp.service';
import {JobRoleDescriptionCacheService} from '../../appCache/JobRoleDescriptionCache.service';
import {AxiosError, AxiosResponse} from 'axios';

@Injectable()
export class JobRoleTemplateService {
  constructor(
    private readonly jobRoleTemplateRepository: JobRoleTemplateRepository,
    private readonly userProfileService: UserProfileService,
    private readonly languageService: LanguageService,
    private readonly jobRoleService: JobRoleService,
    private readonly httpService: CustomHttpService,
    private readonly logger: Logger,
    private readonly CountryService: CountryService,
    private readonly tenantService: TenantService,
    private readonly appConfig: AppConfigService,
    private readonly cache: JobRoleDescriptionCacheService,
  ) {}

  public async getAll(tenantId: number): Promise<JobRoleTemplate[]> {
    return this.jobRoleTemplateRepository.findAll(tenantId);
  }

  public async findOneByJobRoleForUserLanguage(tenantId: number, jobRoleId: string, userId: string): Promise<string[]> {
    const userProfile = await this.userProfileService.get(tenantId, userId);
    let data;
    if (userProfile) {
      const languageCode = userProfile.language.split('_')[0].toLowerCase();
      const language = await this.languageService.findOneByCode(languageCode);
      data = await this.jobRoleTemplateRepository.findOneByJobRoleAndLanguage(tenantId, jobRoleId, language.id);
    } else {
      data = await this.jobRoleTemplateRepository.findOneByJobRole(tenantId, jobRoleId);
    }

    return data ? [data.template] : [];
  }

  public async getJobRoleTemplateForRC(
    baseUrl: string,
    tenantId: number,
    userId: string,
    jobRoleId: string,
  ): Promise<string[]> {
    const [{infoSkillCode}, {countryId, brand}, {language}] = await Promise.all([
      this.jobRoleService.findOneByRoleId(tenantId, jobRoleId),
      this.tenantService.findOne(tenantId),
      this.userProfileService.getOne(userId),
    ]);
    const {code: countryCode} = await this.CountryService.findOne(countryId);

    let data = await this.cache.get({countryCode, brand, infoSkillCode, language});

    if (!data) {
      let res:
        | AxiosResponse<{
            jobDescriptions: {responsibilities: string}[];
          }>
        | AxiosError;
      try {
        res = await this.httpService
          .get(`${baseUrl}/clientPortalGetJobDescription`, {
            headers: {
              'Ocp-Apim-Subscription-Key': this.appConfig.jobRoleTemplateServiceConfig.apimSubscriptionKey,
            },
            params: {
              recruiterEmail: this.appConfig.jobRoleTemplateServiceConfig.recruiterEmail,
              country: countryCode,
              brand,
              infoSkillCode,
              lang: language,
            },
          })
          .toPromise();
        data = res.data.jobDescriptions.map(({responsibilities}) => responsibilities);
        this.cache.set({countryCode, brand, infoSkillCode, language}, data);
      } catch (error) {
        this.logger.error(__filename, `JobRoleTemplate: Couldn't fetch template for RC`, error);
        const {response} = res as AxiosError;
        throw new SharedErrors.InternalError({
          message: JSON.stringify({response}),
        });
      }
    }

    return data;
  }

  public async findAllByJobRole(tenantId: number, jobRoleId: string): Promise<JobRoleTemplate[]> {
    return this.jobRoleTemplateRepository.findAllByJobRole(tenantId, jobRoleId);
  }
}
