import {HttpService, Injectable} from '@nestjs/common';
import {AppConfigService} from '../../core/config/appConfig.service';
import {AzureCognitiveSearchIndex} from './azureCognitiveSearchIndex.enum';
import * as CertificationIndexDefinition from './indexes/certification.json';
import * as DepartmentIndexDefinition from './indexes/department.json';
import * as FunctionIndexDefinition from './indexes/functions.json';
import * as JobRoleIndexDefinition from './indexes/jobRole.json';
import * as LocationIndexDefinition from './indexes/location.json';
import * as UserNameIndexDefinition from './indexes/userName.json';
import {SharedErrors} from '../../core/error/shared.error';
import {DocumentAction} from './documentAction.enum';
import {AzureCognitiveSearchAutoCompleteResponse} from './interfaces/azureCognitiveSearchAutoCompleteResponse.interface';
import {AzureCognitiveSearchOptions} from './interfaces/azureCognitiveSearchOptions.interface';

export const HIGHLIGHT_TAG = '<highlight>';

@Injectable()
export class AzureCognitiveSearchService {
  constructor(private readonly appConfig: AppConfigService, private readonly httpService: HttpService) {}

  private getIndexUrl(indexName: string) {
    const {name, apiVersion} = this.appConfig.azureCognitiveSearch;

    return `https://${name}.search.windows.net/indexes/${indexName}?api-version=${apiVersion}`;
  }

  private getPostDataUrl(indexName: string) {
    const {name, apiVersion} = this.appConfig.azureCognitiveSearch;

    return `https://${name}.search.windows.net/indexes/${indexName}/docs/index?api-version=${apiVersion}`;
  }

  private getDocumentUrl(indexName: string, key: string) {
    const {name, apiVersion} = this.appConfig.azureCognitiveSearch;

    return `https://${name}.search.windows.net/indexes/${indexName}/docs/${key}?api-version=${apiVersion}`;
  }

  private getSearchUrl(indexName: string) {
    const {name, apiVersion} = this.appConfig.azureCognitiveSearch;

    return `https://${name}.search.windows.net/indexes/${indexName}/docs/search?api-version=${apiVersion}`;
  }

  private getAutoCompleteUrl(indexName: string) {
    const {name, apiVersion} = this.appConfig.azureCognitiveSearch;

    return `https://${name}.search.windows.net/indexes/${indexName}/docs/autocomplete?api-version=${apiVersion}`;
  }

  private async request(url, method, apiKey, data = null) {
    const headers = {
      'Content-Type': 'application/json',
      'api-key': apiKey,
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

  private checkForHttpError(res, id: string) {
    if (res.isAxiosError) {
      const {response} = res;
      const {status} = response;

      if (status === 404) {
        throw new SharedErrors.EntityNotFoundError({
          name: 'AzureCognitiveSearch',
          id,
        });
      } else {
        throw new SharedErrors.InternalError({
          message: JSON.stringify({response}),
        });
      }
    }
  }

  public getIndexNameForTenant(indexName: AzureCognitiveSearchIndex, tenantId?: number) {
    return `${this.appConfig.envPrefix}-${indexName}-${tenantId}`;
    //return `${this.appConfig.envPrefix}-${indexName}${tenantId ? `-${tenantId}` : ''}`;
  }

  public async checkIndexExists(indexName: string) {
    try {
      const endpoint = this.getIndexUrl(indexName);
      const response = await this.request(endpoint, 'GET', this.appConfig.azureCognitiveSearch.adminKey);

      return !(response as any).isAxiosError;
    } catch (e) {
      return false;
    }
  }

  public async deleteIndex(indexName: string) {
    const endpoint = this.getIndexUrl(indexName);

    const response = await this.request(endpoint, 'DELETE', this.appConfig.azureCognitiveSearch.adminKey);

    this.checkForHttpError(response, indexName);

    return response.data;
  }

  public async createIndex(indexName: string, definition) {
    const endpoint = this.getIndexUrl(indexName);

    const response = await this.request(endpoint, 'PUT', this.appConfig.azureCognitiveSearch.adminKey, definition);

    this.checkForHttpError(response, indexName);

    return response.data;
  }

  public async createIndexIfNotExists(indexName: AzureCognitiveSearchIndex, tenantId?: number) {
    const indexNameForTenant = this.getIndexNameForTenant(indexName, tenantId);
    const exists = await this.checkIndexExists(indexNameForTenant);

    if (!exists) {
      let baseDefinition;

      if (indexName === AzureCognitiveSearchIndex.CERTIFICATIONS) {
        baseDefinition = CertificationIndexDefinition;
      } else if (indexName === AzureCognitiveSearchIndex.DEPARTMENTS) {
        baseDefinition = DepartmentIndexDefinition;
      } else if (indexName === AzureCognitiveSearchIndex.FUNCTIONS) {
        baseDefinition = FunctionIndexDefinition;
      } else if (indexName === AzureCognitiveSearchIndex.JOBROLES) {
        baseDefinition = JobRoleIndexDefinition;
      } else if (indexName === AzureCognitiveSearchIndex.LOCATIONS) {
        baseDefinition = LocationIndexDefinition;
      } else if (indexName === AzureCognitiveSearchIndex.USERNAMES) {
        baseDefinition = UserNameIndexDefinition;
      }

      const definition = Object.assign({}, baseDefinition.default, {
        name: indexNameForTenant,
      });

      return this.createIndex(indexNameForTenant, definition);
    }
  }

  public async postData(indexName: string, action: DocumentAction, data: Array<Partial<any>>) {
    const endpoint = this.getPostDataUrl(indexName);

    const response = await this.request(endpoint, 'POST', this.appConfig.azureCognitiveSearch.adminKey, {
      value: data.map((it) => {
        it['@search.action'] = action;

        return it;
      }),
    });

    this.checkForHttpError(response, indexName);

    return response.data;
  }

  public async getOne(indexName: string, key: string) {
    const endpoint = this.getDocumentUrl(indexName, key);

    const response = await this.request(endpoint, 'GET', this.appConfig.azureCognitiveSearch.queryKey);

    this.checkForHttpError(response, indexName);

    return response.data;
  }

  public async query(indexName: string, searchTerm: string, options?: AzureCognitiveSearchOptions) {
    const endpoint = this.getSearchUrl(indexName);

    const response = await this.request(
      endpoint,
      'POST',
      this.appConfig.azureCognitiveSearch.queryKey,
      Object.assign({}, options, {
        search: searchTerm,
        searchMode: 'all',
      }),
    );

    this.checkForHttpError(response, indexName);

    const result = response.data?.value ?? [];

    return !!options.highlight
      ? result.map((it) => this.parseHighlights(it, options.highlightPreTag, options.highlightPostTag))
      : result;
  }

  public async fuzzyQuery(indexName: string, searchTerm: string, options?: AzureCognitiveSearchOptions) {
    const endpoint = this.getSearchUrl(indexName);

    const response = await this.request(
      endpoint,
      'POST',
      this.appConfig.azureCognitiveSearch.queryKey,
      Object.assign({}, options, {
        search: `${searchTerm}~`,
        searchMode: 'all',
        queryType: 'full',
      }),
    );

    this.checkForHttpError(response, indexName);

    const result = response.data?.value ?? [];

    return !!options.highlight
      ? result.map((it) => this.parseHighlights(it, options.highlightPreTag, options.highlightPostTag))
      : result;
  }

  public async autoComplete(
    indexName: string,
    search: string,
    suggesterName: string,
    searchFields?: string[],
  ): Promise<Array<AzureCognitiveSearchAutoCompleteResponse>> {
    const endpoint = this.getAutoCompleteUrl(indexName);
    const query = {
      suggesterName,
      search,
      autocompleteMode: 'twoTerms',
      fuzzy: true,
      searchFields: searchFields?.join(', '),
    };

    const response = await this.request(endpoint, 'POST', this.appConfig.azureCognitiveSearch.queryKey, query);

    return response.data?.value ?? [];
  }

  public async deleteOne(indexName: string, keyName: string, keyValue: string) {
    const endpoint = this.getPostDataUrl(indexName);

    const response = await this.request(endpoint, 'POST', this.appConfig.azureCognitiveSearch.adminKey, {
      value: [
        {
          '@search.action': DocumentAction.DELETE,
          [keyName]: keyValue,
        },
      ],
    });

    this.checkForHttpError(response, indexName);

    return response.data;
  }

  private parseHighlights(entry: any, highlightPreTag: string = '<em>', highlightPostTag: string = '</em>') {
    const copy = Object.assign({}, entry);

    // @search.highlights contains only sentences that have the matching keyword
    const highlights = copy['@search.highlights'];

    Object.keys(highlights).forEach((it) => {
      highlights[it].forEach((highlight) => {
        // Remove the highlight tags to get the original subtext
        const subtext = highlight.replaceAll(highlightPreTag, '').replaceAll(highlightPostTag, '');

        // Replace the original subtext in the main fields with the subtext that contains the highlight tags
        copy[it] = copy[it].replace(subtext, highlights[it]);
      });
    });

    delete copy['@search.highlights'];

    return copy;
  }
}
