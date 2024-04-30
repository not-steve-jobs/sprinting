import {ExternalIdType} from './externalIdType.enum';
import {TenantService} from 'src/modules/tenant/tenant.service';
import {PersonDto} from './dto/person.dto';
import {Injectable} from '@nestjs/common';
import {AppConfigService} from '../../core/config/appConfig.service';
import {SharedErrors} from '../../core/error/shared.error';
import {Logger} from 'src/core/logger';
import {PrincipalName} from '../common/principalName.interface';
import {GetTenantDocumentDto} from './dto/getTenantDocument.dto';
import {UploadTenantDocumentDto} from './dto/uploadTenantDocument.dto';
import {default as FormData} from 'form-data';
import {GetPersonalDocumentDto} from './dto/getPersonalDocument.dto';
import {CustomHttpService} from '../customHttp/customHttp.service';

@Injectable()
export class PersonService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly httpService: CustomHttpService,
    private readonly tenantService: TenantService,
    private readonly logger: Logger,
  ) {}

  private getRequestUrl(personId: string, countryCode: string = '') {
    const baseUrl = this.appConfig.personServiceConfig.url;

    return `${baseUrl}v2/${countryCode}/api/persons/${personId}?fields=firstName%2ClastName&externalIdType=${ExternalIdType.InfoCandidateId}`;
  }

  private uploadTenantDocumentsRequestUrl(countryCode: string = '', externalDocId: string = null) {
    const baseUrl = this.appConfig.personServiceConfig.url;
    if (externalDocId) {
      return `${baseUrl}v2/${countryCode}/api/tenantDocuments?externalDocId=${externalDocId}`;
    } else {
      return `${baseUrl}v2/${countryCode}/api/tenantDocuments`;
    }
  }

  private getPersonalDocumentsRequestUrl(personId: string, countryCode: string, externalDocIds: string) {
    const baseUrl = this.appConfig.personServiceConfig.url;
    return `${baseUrl}v2/${countryCode}/api/persons/${personId}/documents?externalDocIds=${externalDocIds}&externalIdType=infoCandidateId`;
  }

  private getTenantDocumentsRequestUrl(countryCode: string = '', externalDocIds: string, multiple: boolean = true) {
    const baseUrl = this.appConfig.personServiceConfig.url;
    const externalDocIdString = multiple ? 'externalDocIds' : 'externalDocId';
    return `${baseUrl}v2/${countryCode}/api/tenantDocuments?${externalDocIdString}=${externalDocIds}`;
  }

  private async request(url: string, method, tenantId: number, data = null) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Principal-Name': PrincipalName.ClientAccess,
      'X-Tenant-Id': tenantId,
      'Ocp-Apim-Subscription-Key': this.appConfig.personServiceConfig.apimSubscriptionKey,
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

  private async upload(url: string, tenantId: number, file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    //formData.append('file', new Blob([file.buffer], {type: file.mimetype}), file.originalname);
    const headers = {
      'X-Principal-Name': PrincipalName.ClientAccess,
      'X-Tenant-Id': tenantId,
      'Ocp-Apim-Subscription-Key': this.appConfig.personServiceConfig.apimSubscriptionKey,
      'Content-Type': 'multipart/form-data',
      Accept: 'multipart/form-data',
    };
    const formHeaders = formData.getHeaders();
    const result = this.httpService
      .post(url, formData, {
        headers: {
          ...headers,
          ...formHeaders,
        },
      })
      .toPromise();
    return result;
  }

  public async getById(tenantId: number, personId: string): Promise<PersonDto> {
    const person = new PersonDto();

    const tenant = await this.tenantService.findOneWithRelations(tenantId);
    const countryCode = tenant?.country?.code ?? null;

    try {
      const response = await this.request(this.getRequestUrl(personId, countryCode), 'GET', tenantId);
      this.checkForHttpError(response, personId);
      person.id = response.data.personId;
      person.firstName = response.data.firstName;
      person.lastName = response.data.lastName;
    } catch (error) {
      // TODO: log / handle properly
      person.id = 0;
      person.firstName = '-- N/A';
      person.lastName = '--';
      this.logger.error(__filename, `PersonService: Couldn't fetch user data ${personId}`, {url: error?.config?.url});
    }

    return person;
  }

  public async uploadTenantDocument(
    tenantId: number,
    file: Express.Multer.File,
    fileId: string = null,
  ): Promise<UploadTenantDocumentDto> {
    const tenant = await this.tenantService.findOneWithRelations(tenantId);
    const countryCode = tenant?.country?.code ?? null;
    const uploadTenantDocumentResponse = new UploadTenantDocumentDto();

    try {
      const response = await this.upload(this.uploadTenantDocumentsRequestUrl(countryCode, fileId), tenantId, file);
      uploadTenantDocumentResponse.externalDocId = response.data.externalDocId;
    } catch (error) {
      uploadTenantDocumentResponse.externalDocId = null;
    }

    return uploadTenantDocumentResponse;
  }

  public async deleteTenantDocument(tenantId: number, fileId: string = null): Promise<any> {
    const tenant = await this.tenantService.findOneWithRelations(tenantId);
    const countryCode = tenant?.country?.code ?? null;
    let response;

    try {
      response = await this.request(this.getTenantDocumentsRequestUrl(countryCode, fileId, false), 'DELETE', tenantId);
    } catch (error) {
      throw error;
    }

    return response;
  }

  public async getTenantDocument(tenantId: number, fileId: string): Promise<GetTenantDocumentDto> {
    const tenant = await this.tenantService.findOneWithRelations(tenantId);
    const countryCode = tenant?.country?.code ?? null;
    const getTenantDocumentResponse = new GetTenantDocumentDto();

    try {
      const response = await this.request(this.getTenantDocumentsRequestUrl(countryCode, fileId), 'GET', tenantId);
      getTenantDocumentResponse.externalDocId = response.data[0].externalDocId;
      getTenantDocumentResponse.url = response.data[0].url;
    } catch (error) {
      throw error;
    }

    return getTenantDocumentResponse;
  }

  public async getPersonalDocument(
    tenantId: number,
    personId: string,
    fileId: string,
  ): Promise<GetPersonalDocumentDto> {
    const tenant = await this.tenantService.findOneWithRelations(tenantId);
    const countryCode = tenant?.country?.code ?? null;
    const getPersonalDocumentResponse = new GetPersonalDocumentDto();

    try {
      const response = await this.request(
        this.getPersonalDocumentsRequestUrl(personId, countryCode, fileId),
        'GET',
        tenantId,
      );
      getPersonalDocumentResponse.id = response.data[0].id;
      getPersonalDocumentResponse.personId = response.data[0].personId;
      getPersonalDocumentResponse.externalDocId = response.data[0].externalDocId;
      getPersonalDocumentResponse.url = response.data[0].url;
      getPersonalDocumentResponse.createdAt = response.data[0].createdAt;
      getPersonalDocumentResponse.updatedAt = response.data[0].updatedAt;
    } catch (error) {
      throw error;
    }

    return getPersonalDocumentResponse;
  }

  private checkForHttpError(res, personId: string) {
    if (res.isAxiosError) {
      const {response} = res;
      const {status} = response;

      if (status === 404) {
        throw new SharedErrors.EntityNotFoundError({
          name: 'PersonService',
          id: personId,
        });
      } else {
        throw new SharedErrors.InternalError({
          message: JSON.stringify({response}),
        });
      }
    }
  }
}
