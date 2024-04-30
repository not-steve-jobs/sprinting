import {PlainObject} from 'src/modules/common/common.dto';
import {Injectable} from '@nestjs/common';
import {AppConfigService} from '../../core/config/appConfig.service';
import {Logger} from 'src/core/logger';
import {CandidateDto} from './dto/candidate.dto';
import {AamBackendError} from './aamBackend.error';
import {SharedErrors} from 'src/core/error/shared.error';
import {UrlType} from './urlType.enum';
import {CustomHttpService} from '../customHttp/customHttp.service';

@Injectable()
export class AamBackendService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly httpService: CustomHttpService,
    private readonly logger: Logger,
  ) {}
  /**
   * Provide valid url based on type of url.
   *
   * @param {UrlType} urlType
   * @return {string}
   * @memberof AamBackendService
   */
  public getRequestUrl(urlType: UrlType): string {
    const baseUrl = this.appConfig.aamBackendConfig.url;
    if (!baseUrl) {
      throw new SharedErrors.MissingEnvVariable({envVariable: 'AAMBACKEND_URL'});
    }
    switch (urlType) {
      case UrlType.CandidatesListData:
        return `${baseUrl}api/external/candidate/_getSummary`;
      default:
        break;
    }

    throw new AamBackendError.MissingAamBackendUrlCase({urlCase: urlType});
  }
  /**
   * Create request to ammBE
   *
   * @private
   * @param {string} url - request url
   * @param {*} method - method type
   * @param {number} tenantId
   * @param {(PlainObject | null)} [data=null]
   * @return {*} {Promise<PlainObject>}
   * @memberof AamBackendService
   */
  private async request(url: string, method, tenantId: number, data: PlainObject | null = null): Promise<PlainObject> {
    const subscriptionKey = this.appConfig.aamBackendConfig.apimSubscriptionKey;

    if (!subscriptionKey) {
      throw new SharedErrors.MissingEnvVariable({envVariable: 'AAMBACKEND_APIM_SUBSCRIPTION_KEY'});
    }

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Principal-Name': 'ClientPortal',
      'X-TenantId': tenantId,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    };

    return this.httpService
      .request({
        url,
        method,
        headers,
        data,
      })
      .toPromise();
  }
  /**
   * Retrieve candidates data from aamBE
   *
   * @param {number} tenantId
   * @param {string[]} candidateIdList - this represent list of inFO candidate ids
   * @return {*}  {Promise<CandidateDto[]>}
   * @memberof AamBackendService
   */
  public async getCandidateData(tenantId: number, candidateIdList: string[]): Promise<CandidateDto[]> {
    try {
      let data: CandidateDto[] = [];
      try {
        const response = await this.request(this.getRequestUrl(UrlType.CandidatesListData), 'POST', tenantId, {
          infoCandidateIdList: candidateIdList,
        });
        data = response?.data?.candidateList ?? [];
      } catch (error) {
        this.logger.error(__filename, `AamBackend: Couldn't fetch data for candidates`, error);
      }

      return data.map(
        ({id, infoCandidateId, yearsOfExperience, city, country, languages, workExperience, educationType}) => {
          return {
            id: id ?? infoCandidateId,
            yearsOfExperience: yearsOfExperience ?? 0,
            city: city ?? null,
            country: country ?? null,
            languages,
            educationType: educationType ?? null,
            workExperience: (workExperience ?? []).map(({yearsOfExperience: roleYearsOfExperience, roleName}) => ({
              yearsOfExperience: roleYearsOfExperience ?? 0,
              roleName: roleName ?? null,
            })),
          };
        },
      );
    } catch (error) {
      this.logger.error(__filename, `AamBackend: Couldn't fetch data for candidates (generic)`, {
        candidateIdList,
        error: {
          message: error?.message,
        },
      });
      return [];
    }
  }
}
