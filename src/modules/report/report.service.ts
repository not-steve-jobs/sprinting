import {Injectable} from '@nestjs/common';
import {AppConfigService} from '../../core/config/appConfig.service';
import {Logger} from 'src/core/logger';
import {PowerBiReportData} from './powerBiReportData';
import {EmbedConfigData, EmbedToken} from './embedConfigData';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {AuthenticationModeEnum} from './report.enum';
import {ReportServiceErrors} from './report.error';
import {ReportTokenDto} from './dto/ReportToken.dto';
import {SharedErrors} from '../../core/error/shared.error';
import {PlainObject} from '../common/common.dto';
import {AxiosResponse} from 'axios';
import {CustomHttpService} from '../customHttp/customHttp.service';
import adal = require('adal-node');

@Injectable()
export class ReportService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly httpService: CustomHttpService,
    private readonly logger: Logger,
    private readonly tenantUserRepository: TenantUserRepository,
  ) {}

  /**
   * Generate PowerBI token
   *
   * @param {number} tenantId
   * @param {string} userId
   * @returns {Promise<ReportTokenDto>}
   * @memberof ReportService
   */
  public async getPowerBIToken(tenantId: number, userId: string): Promise<ReportTokenDto> {
    try {
      this.validatePowerBiConfiguration();
    } catch (error) {
      this.logger.error(__filename, 'PowerBi Embed Report Error validating PowerBI configuration', error);
      return {
        accessToken: null,
        embedUrl: null,
        expiry: null,
      };
    }

    const tenantUser = await this.tenantUserRepository.findOne(tenantId, userId);

    try {
      const embedParams = await this.getEmbedParamsForSingleReport(
        this.appConfig.powerBi.workspaceId,
        this.appConfig.powerBi.reportId,
        tenantUser,
      );

      return {
        accessToken: embedParams.embedToken.token,
        embedUrl: embedParams.reportsDetail,
        expiry: embedParams.embedToken.expiration,
      };
    } catch (error) {
      this.logger.error(
        __filename,
        `PowerBi Embed Report Generate Token Error: Error while retrieving report embed details\r\n${
          error.statusText
        }\r\nRequestId: \n${error.headers.get('requestid')}`,
        error,
      );
      return {
        accessToken: null,
        embedUrl: null,
        expiry: null,
      };
    }
  }

  /**
   * Get embed params for single report
   *
   * @param {string} workspaceId
   * @param {string} reportId
   * @param {TenantUser} TenantUser
   * @param {string} additionalDatasetId
   * @returns {Promise<ReportTokenDto>}
   * @memberof ReportService
   */
  private async getEmbedParamsForSingleReport(
    workspaceId: string,
    reportId: string,
    tenantUser: TenantUser,
    additionalDatasetId?: string,
  ): Promise<EmbedConfigData> {
    const reportInGroupApi = `${this.appConfig.powerBi.reportInGroupApiUrl}/${workspaceId}/reports/${reportId}`;
    const headers = await this.getRequestHeader();

    let result = null;

    try {
      result = await this.request(reportInGroupApi, 'GET', headers);
    } catch (error) {
      this.logger.error(__filename, `PowerBi Embed Report Get Report In Group Error: ${error}`, error);
      throw new ReportServiceErrors.GetReportInGroupError();
    }

    const resultJson = await result.data;

    const reportDetails: PowerBiReportData = {
      reportId: resultJson.id,
      reportName: resultJson.name,
      embedUrl: resultJson.embedUrl,
    };
    const reportEmbedConfig: EmbedConfigData = {};

    reportEmbedConfig.reportsDetail = [reportDetails];

    const datasetIds = [resultJson.datasetId];

    if (additionalDatasetId) {
      datasetIds.push(additionalDatasetId);
    }

    reportEmbedConfig.embedToken = await this.getEmbedTokenForSingleReportSingleWorkspace(
      reportId,
      datasetIds,
      workspaceId,
      tenantUser,
    );

    return reportEmbedConfig;
  }

  /**
   * Get embed token for single report single workspace
   *
   * @param {string} reportId
   * @param {string[]} datasetIds
   * @param {string} targetWorkspaceId
   * @param {TenantUser} TenantUser
   * @returns {Promise<ReportTokenDto>}
   * @memberof ReportService
   */
  private async getEmbedTokenForSingleReportSingleWorkspace(
    reportId: string,
    datasetIds: string[],
    targetWorkspaceId: string,
    tenantUser: TenantUser,
  ): Promise<EmbedToken> {
    const formData = {
      reports: [
        {
          id: reportId,
        },
      ],
    };

    formData['datasets'] = [];
    for (const datasetId of datasetIds) {
      formData['datasets'].push({
        id: datasetId,
      });
    }

    if (targetWorkspaceId) {
      formData['targetWorkspaces'] = [];
      formData['targetWorkspaces'].push({
        id: targetWorkspaceId,
      });
    }

    formData['identities'] = [
      {
        username: tenantUser.user.email,
        roles: ['RoleAdmin'],
        datasets: datasetIds,
      },
    ];

    const embedTokenApi = this.appConfig.powerBi.embedTokenApiUrl;
    const headers = await this.getRequestHeader();

    let result = null;
    try {
      result = await this.request(embedTokenApi, 'POST', headers, JSON.stringify(formData));
    } catch (error) {
      this.logger.error(__filename, `PowerBi Embed Report Embed Token Request Error: ${error}`, error);
      throw new ReportServiceErrors.EmbedTokenRequestError({message: 'Embed Token Request Error'});
    }

    return result.data;
  }

  /**
   * Get request header
   *
   * @returns {Promise<PlainObject>}
   * @memberof ReportService
   */
  private async getRequestHeader(): Promise<PlainObject> {
    let tokenResponse;
    let errorResponse;

    try {
      tokenResponse = await this.getAccessToken();
    } catch (err) {
      if (err.hasOwnProperty('error_description') && err.hasOwnProperty('error')) {
        errorResponse = err.error_description;
      } else {
        // Invalid PowerBI Username provided
        errorResponse = err.toString();
      }
      this.logger.error(__filename, `PowerBi Embed Report Acquire Auth Token Error: ${errorResponse}`, errorResponse);
      throw new ReportServiceErrors.AcquireAuthTokenError();
    }

    // Extract AccessToken from the response
    const token = tokenResponse.accessToken;
    return {
      'Content-Type': 'application/json',
      Authorization: this.getAuthHeader(token),
    };
  }

  /**
   * Get request header
   *
   * @returns {Promise<PlainObject>}
   * @memberof ReportService
   */
  private async getAccessToken(): Promise<adal.TokenResponse | adal.ErrorResponse> {
    const AuthenticationContext = adal.AuthenticationContext;

    let authorityUrl = this.appConfig.powerBi.authorityUri;

    // Check for the MasterUser Authentication
    if (this.appConfig.powerBi.authenticationMode.toLowerCase() === AuthenticationModeEnum.MASTER_USER) {
      const context = new AuthenticationContext(authorityUrl);

      return new Promise((resolve, reject) => {
        context.acquireTokenWithUsernamePassword(
          this.appConfig.powerBi.scope,
          this.appConfig.powerBi.pbiUsername,
          this.appConfig.powerBi.pbiPassword,
          this.appConfig.powerBi.clientId,
          function (err, tokenResponse) {
            // Function returns error object in tokenResponse
            // Invalid Username will return empty tokenResponse, thus err is used
            if (err) {
              reject(tokenResponse == null ? err : tokenResponse);
            }
            resolve(tokenResponse);
          },
        );
      });

      // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
    } else if (this.appConfig.powerBi.authenticationMode.toLowerCase() === AuthenticationModeEnum.SERVICE_PRINCIPAL) {
      authorityUrl = authorityUrl.replace('common', this.appConfig.powerBi.tenantId);
      const context = new AuthenticationContext(authorityUrl);

      return new Promise((resolve, reject) => {
        context.acquireTokenWithClientCredentials(
          this.appConfig.powerBi.scope,
          this.appConfig.powerBi.clientId,
          this.appConfig.powerBi.clientSecret,
          function (err, tokenResponse) {
            // Function returns error object in tokenResponse
            // Invalid Username will return empty tokenResponse, thus err is used
            if (err) {
              reject(tokenResponse == null ? err : tokenResponse);
            }
            resolve(tokenResponse);
          },
        );
      });
    }
  }

  /**
   * Get auth header
   *
   * @param {string} accessToken
   * @returns {string}
   * @memberof ReportService
   */
  private getAuthHeader(accessToken: string) {
    // Function to append Bearer against the Access Token
    return 'Bearer '.concat(accessToken);
  }

  /**
   * Make request
   *
   * @param {url} url
   * @param {any} method
   * @param {any} headers
   * @param {PlainObject>} data
   * @returns {PlainObject}
   * @memberof ReportService
   */
  private async request(url: string, method: any, headers: any, data = null): Promise<AxiosResponse> {
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
   * Helper function which will check if all required variables are present inside ENV
   *
   * @private
   * @memberof ReportService
   */
  private validatePowerBiConfiguration() {
    if (!this.getWorkspaceId()) {
      this.logger.error(__filename, 'Missing report env variable - POWERBI_WORKSPACE_ID');
      throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_WORKSPACE_ID'});
    }
    if (!this.getReportId()) {
      this.logger.error(__filename, 'Missing report env variable - POWERBI_REPORT_ID');
      throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_REPORT_ID'});
    }
    if (!this.getReportInGroupApiUrl()) {
      this.logger.error(__filename, 'Missing report env variable - POWERBI_REPORT_IN_GROUP_API_URL');
      throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_REPORT_IN_GROUP_API_URL'});
    }
    if (!this.getEmbedTokenApiUrl()) {
      this.logger.error(__filename, 'Missing report env variable - POWERBI_EMBED_TOKEN_API_URL');
      throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_EMBED_TOKEN_API_URL'});
    }
    if (!this.getAuthorityUri()) {
      this.logger.error(__filename, 'Missing report env variable - POWERBI_AUTHORITY_URI');
      throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_AUTHORITY_URI'});
    }
    if (!this.getAuthenticationMode()) {
      this.logger.error(__filename, 'Missing report env variable - POWERBI_AUTHENTICATION_MODE');
      throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_AUTHENTICATION_MODE'});
    }
    if (this.appConfig.powerBi.authenticationMode.toLowerCase() === AuthenticationModeEnum.MASTER_USER) {
      if (!this.getScope()) {
        this.logger.error(__filename, 'Missing report env variable - POWERBI_SCOPE');
        throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_SCOPE'});
      }
      if (!this.getPbiUsername()) {
        this.logger.error(__filename, 'Missing report env variable - POWERBI_PBI_USERNAME');
        throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_PBI_USERNAME'});
      }
      if (!this.getPbiPassword()) {
        this.logger.error(__filename, 'Missing report env variable - POWERBI_PBI_PASSWORD');
        throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_PBI_PASSWORD'});
      }
      if (!this.getClientId()) {
        this.logger.error(__filename, 'Missing report env variable - POWERBI_CLIENT_ID');
        throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_CLIENT_ID'});
      }
    } else if (this.appConfig.powerBi.authenticationMode.toLowerCase() === AuthenticationModeEnum.SERVICE_PRINCIPAL) {
      if (!this.getTenantId()) {
        this.logger.error(__filename, 'Missing report env variable - POWERBI_TENANT_ID');
        throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_TENANT_ID'});
      }
      if (!this.getScope()) {
        this.logger.error(__filename, 'Missing report env variable - POWERBI_SCOPE');
        throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_SCOPE'});
      }
      if (!this.getClientId()) {
        this.logger.error(__filename, 'Missing report env variable - POWERBI_CLIENT_ID');
        throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_CLIENT_ID'});
      }
      if (!this.getClientSecret()) {
        this.logger.error(__filename, 'Missing report env variable - POWERBI_CLIENT_SECRET');
        throw new SharedErrors.MissingEnvVariable({envVariable: 'POWERBI_CLIENT_SECRET'});
      }
    }
  }

  /**
   * Helper function which will fetch 'workspaceId' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getWorkspaceId(): string {
    return this.appConfig?.powerBi?.workspaceId ?? null;
  }

  /**
   * Helper function which will fetch 'reportId' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getReportId(): string | null {
    return this.appConfig?.powerBi?.reportId ?? null;
  }

  /**
   * Helper function which will fetch 'reportInGroupApiUrl' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getReportInGroupApiUrl(): number {
    return this.appConfig?.powerBi?.reportInGroupApiUrl ?? null;
  }

  /**
   * Helper function which will fetch 'embedTokenApiUrl' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getEmbedTokenApiUrl(): number {
    return this.appConfig?.powerBi?.embedTokenApiUrl ?? null;
  }

  /**
   * Helper function which will fetch 'authorityUri' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getAuthorityUri(): number {
    return this.appConfig?.powerBi?.authorityUri ?? null;
  }

  /**
   * Helper function which will fetch 'authenticationMode' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getAuthenticationMode(): number {
    return this.appConfig?.powerBi?.authenticationMode ?? null;
  }

  /**
   * Helper function which will fetch 'scope' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getScope(): number {
    return this.appConfig?.powerBi?.scope ?? null;
  }

  /**
   * Helper function which will fetch 'pbiUsername' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getPbiUsername(): number {
    return this.appConfig?.powerBi?.pbiUsername ?? null;
  }

  /**
   * Helper function which will fetch 'pbiPassword' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getPbiPassword(): number {
    return this.appConfig?.powerBi?.pbiPassword ?? null;
  }

  /**
   * Helper function which will fetch 'clientId' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getClientId(): number {
    return this.appConfig?.powerBi?.clientId ?? null;
  }

  /**
   * Helper function which will fetch 'clientSecret' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getClientSecret(): number {
    return this.appConfig?.powerBi?.clientSecret ?? null;
  }

  /**
   * Helper function which will fetch 'tenantId' variable from ENV
   *
   * @private
   * @return {*} {string | null}
   * @memberof ReportService
   */
  private getTenantId(): number {
    return this.appConfig?.powerBi?.tenantId ?? null;
  }
}
