import {TestingModuleBuilder} from '@nestjs/testing';

import {mockInitAuthenticationContextMiddleware} from '../mocks/InitAuthenticationContextMiddleware.mock';
import {mockAzureIdpAuthMiddleware} from '../mocks/AzureIdpAuthMiddleware.mock';

export interface MockProviderOptions {
  provider: any;
  mockMethod: MockMethodEnum;
  mockedProvider: any;
}

export enum MockMethodEnum {
  UseClass = 'useClass',
  UseValue = 'useValue',
  UseFactory = 'useFactory',
}

/**
 * Will modify the passed moduleRef by overriding the defined providers with the mocked ones
 *
 * @param {TestingModuleBuilder} moduleRefBuilder - A simple test module for the Nest application
 * @param {MockProviderOptions} mockOption - Mock provider option containing data which used for overriding the default module provider
 */
export const addMockedProviderToModule = (moduleRefBuilder: TestingModuleBuilder, mockOption: MockProviderOptions) => {
  const {provider, mockMethod, mockedProvider} = mockOption;

  switch (mockMethod) {
    case MockMethodEnum.UseValue:
      moduleRefBuilder.overrideProvider(provider).useValue(mockedProvider);
      break;
    case MockMethodEnum.UseFactory:
      moduleRefBuilder.overrideProvider(provider).useFactory(mockedProvider);
      break;
    case MockMethodEnum.UseClass:
      moduleRefBuilder.overrideProvider(provider).useClass(mockedProvider);
      break;
    default:
      throw Error('Missing "mockMethod" property for the provided mockOption');
  }
};

/**
 * Mock global middleware because they're initialized separately and are not part of the main AppModule

* @param {number} tenantId
 */
export const addMockedMiddleware = (tenantId: number): void => {
  mockInitAuthenticationContextMiddleware();
  mockAzureIdpAuthMiddleware(tenantId);
};
