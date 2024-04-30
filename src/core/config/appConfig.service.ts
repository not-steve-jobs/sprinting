import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {englishUsa} from 'src/seed/tenantSpecific/featureConfiguration/features/Localization/data/languages.data';
import {NodeCacheConfig} from './appConfig.interface';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env() {
    return this.configService.get('NODE_ENV');
  }

  get envPrefix() {
    return this.configService.get('ENV_PREFIX');
  }

  get loadedEnvironment() {
    return this.configService.get('loadedEnvironment');
  }

  get app() {
    const port = this.configService.get('app.port');
    return {
      port: parseInt(port || 3000, 10),
    };
  }

  get azureApplicationInsights() {
    return {
      enabled: this.configService.get('appInsights.enabled') === true,
      instrumentationKey: this.configService.get('appInsights.instrumentation_key'),
    };
  }

  get db() {
    return {
      host: this.configService.get('dbConfig.host'),
      port: Number(this.configService.get('dbConfig.port')),
      username: this.configService.get('dbConfig.username'),
      password: this.configService.get('dbConfig.password'),
      database: this.configService.get('dbConfig.database'),
      logging: this.configService.get('dbConfig.logging'),
      ssl: this.configService.get('dbConfig.ssl'),
      maxQueryExecutionTime: this.configService.get('dbConfig.maxQueryExecutionTime'),
      connectTimeoutMS: this.configService.get('dbConfig.maxQueryExecutionTime'),
      extra: {
        max: this.configService.get('dbConfig.connectionPoolSize'),
      },
    };
  }

  get authConfig() {
    const tenantName = this.configService.get('authConfig.AzureIdp.tenantName');
    const signInUserFlow = this.configService.get('authConfig.AzureIdp.signInUserFlow');
    const issuerId = this.configService.get('authConfig.AzureIdp.issuerId');
    return {
      algorithm: 'RS256',
      privateKey: `-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----\n`,
      publicKey:
        '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAs9ehxoD9Al0AOrFpOLyv\n0hwnHrCE8qRVgdXbcSd1zGH/ol4i5pEWBzq0E5Q+TUyR1RruwHvkHUSuZ0LMRHRY\nLvDHnyzVTfMmOsro9abppprv2l9fU+Mp9Ys9IRur9+gav8d/myVo2e3JIOvVi5pY\nZLhjtlx+B7NepWRp9j2gmYfWdxBY3ofIM3Li8vPO8vpzh3fm3+BnzyyL4kgMjAm9\nhbWOHALzJasgXjFdkjRuowh/31IA9gnzQaB27g4b3O0P4Lmu8T02iDVvOmG+fc3I\nHc+cI610XpZ7txUus8W4T0kuqUTmfjqoEe8MTlTbte+28VjxULnLHRyd2WWigJjN\nED9QATZNAg2uXmk4EJ6Ds+saDYuYSe5cHwU8gH7xeZOUy1ORXcl4eIIdp7fGuTgO\n8XgCjuD1k10gUK6lcMK23K2PjeWQo8C4bl+W8w2LstnLBpjbWB0SO19LUcbSjwys\nxagr6Iq0bJOMGdqzhTrAjLfcmxvr8qNbj0q0sGz3E2E2SLNw6FFv9/3Z6rt++fxC\nF1v3rzXzmj/0z+RLhsUGwu6w1Heaw7vmQaampH6ORcj9UNWb1FfST3Xg0gTolMZs\nHysX+siWu4szIemrnUgautflyL/FjVsnY3PCndo/ubTrV+/+e11utBLJyaHmSCcV\ntI74LP4+AESF3Lzx/UeXhbUCAwEAAQ==\n-----END PUBLIC KEY-----',
      iss: 'clabackend',
      aud: 'clabackend',
      AzureIdp: {
        jwksUri: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/discovery/v2.0/keys?p=${signInUserFlow}`,
        azureIss: `https://${tenantName}.b2clogin.com/${issuerId}/v2.0/`,
        keyCacheMaxEntries: 10,
      },
    };
  }

  get azureStorageConfig() {
    return this.configService.get('azureStorageConfig');
  }

  get azureCognitiveSearch() {
    return {
      name: this.configService.get('azureCognitiveSearch.name'),
      apiVersion: this.configService.get('azureCognitiveSearch.apiVersion'),
      adminKey: this.configService.get('azureCognitiveSearch.adminKey'),
      queryKey: this.configService.get('azureCognitiveSearch.queryKey'),
    };
  }

  get infoSystemIntegration() {
    return {
      eventsEnabled: this.configService.get('infoSystemIntegration.eventsEnabled'),
      eventLogsEnabled: this.configService.get('infoSystemIntegration.eventLogsEnabled'),
      eventsConnectionString: this.configService.get('infoSystemIntegration.eventsConnectionString'),
      eventsTopic: this.configService.get('infoSystemIntegration.eventsTopic'),
      eventsSubscription: this.configService.get('infoSystemIntegration.eventsSubscription'),
      commandsEnabled: this.configService.get('infoSystemIntegration.commandsEnabled'),
      commandsConnectionString: this.configService.get('infoSystemIntegration.commandsConnectionString'),
      commandsTopic: this.configService.get('infoSystemIntegration.commandsTopic'),
      commandsSubscription: this.configService.get('infoSystemIntegration.commandsSubscription'),
      outputTopic: this.configService.get('infoSystemIntegration.outputTopic'),
      outputSubscription: this.configService.get('infoSystemIntegration.outputSubscription'),
      errorTopic: this.configService.get('infoSystemIntegration.errorTopic'),
      errorSubscription: this.configService.get('infoSystemIntegration.errorSubscription'),
    };
  }

  get emailQueue() {
    return {
      enabled: this.configService.get('emailQueue.enabled'),
      connectionString: this.configService.get('emailQueue.connectionString'),
      queueName: this.configService.get('emailQueue.queueName'),
    };
  }

  get clientAccessEvents() {
    return {
      eventsEnabled: this.configService.get('clientAccessEvents.eventsEnabled'),
      eventsConnectionString: this.configService.get('clientAccessEvents.eventsConnectionString'),
      eventsTopic: this.configService.get('clientAccessEvents.eventsTopic'),
    };
  }

  get notificationSenderConfig() {
    return {
      sendgridApiKey: this.configService.get('notificationSenderConfig.sendgridApiKey'), // TODO: Deprecated, to be removed once we turn off Sendgrid completely
      verifiedEmailUsedToSendMails: this.configService.get('notificationSenderConfig.verifiedEmailUsedToSendMails'), // TODO: Deprecated, to be removed once we turn off Sendgrid completely
      mmmHubApiBaseUrl: this.configService.get('notificationSenderConfig.mmmHubApiBaseUrl'),
      mmmHubApiSubscriptionKey: this.configService.get('notificationSenderConfig.mmmHubApiSubscriptionKey'),
    };
  }

  get mailTemplates(): [{name: string; id: string}] {
    return this.configService.get('mailTemplates');
  }

  get hostNameUrls(): [{hostName: string; url: string}] {
    return this.configService.get('hostNameUrls');
  }

  get azureServiceBus() {
    return {
      connectionString: this.configService.get('azureServiceBus.connectionString'),
    };
  }

  get personServiceConfig() {
    return {
      url: this.configService.get('personService.url'),
      apimSubscriptionKey: this.configService.get('personService.apimSubscriptionKey'),
    };
  }

  get reportSenderConfig() {
    return {
      destinationEmail: this.configService.get('reportSender.destinationEmail'),
    };
  }

  get powerBi() {
    return this.configService.get('powerBi');
  }

  get aamBackendConfig() {
    return {
      url: this.configService.get('aamBackend.url'),
      apimSubscriptionKey: this.configService.get('aamBackend.apimSubscriptionKey'),
    };
  }

  get jobRoleTemplateServiceConfig() {
    return {
      apimSubscriptionKey: this.configService.get('jobRoleTemplateService.apimSubscriptionKey'),
      recruiterEmail: this.configService.get('jobRoleTemplateService.recruiterEmail'),
    };
  }

  get redis() {
    return {
      host: this.configService.get('redis.host'),
      port: this.configService.get('redis.port'),
      password: this.configService.get('redis.accessKey'),
    };
  }

  get googleMaps() {
    return {
      apiKey: this.configService.get('google.apiKey'),
    };
  }

  get mmmHubEventCallbackConfig() {
    return {
      key: this.configService.get('mmmHubEventCallback.signatureKey'),
    };
  }

  get transformationsConfig() {
    return {
      useCLPTransformations: this.configService.get('transformations.useCLPTransformations'),
    };
  }

  get salesForceIntegration() {
    return {
      eventsEnabled: this.configService.get('salesForceIntegration.eventsEnabled'),
      eventLogsEnabled: this.configService.get('salesForceIntegration.eventLogsEnabled'),
      eventsConnectionString: this.configService.get('salesForceIntegration.eventsConnectionString'),
      eventsTopic: this.configService.get('salesForceIntegration.eventsTopic'),
      eventsSubscription: this.configService.get('salesForceIntegration.eventsSubscription'),
      commandsEnabled: this.configService.get('salesForceIntegration.commandsEnabled'),
      commandsConnectionString: this.configService.get('salesForceIntegration.commandsConnectionString'),
      commandsTopic: this.configService.get('salesForceIntegration.commandsTopic'),
      commandsSubscription: this.configService.get('salesForceIntegration.commandsSubscription'),
      outputTopic: this.configService.get('salesForceIntegration.outputTopic'),
      outputSubscription: this.configService.get('salesForceIntegration.outputSubscription'),
      errorTopic: this.configService.get('salesForceIntegration.errorTopic'),
      errorSubscription: this.configService.get('salesForceIntegration.errorSubscription'),
    };
  }

  get elasticApm() {
    return this.configService.get('elasticApm');
  }

  get nodeCache(): NodeCacheConfig {
    return this.configService.get('nodeCache');
  }

  get defaultLanguageLocale() {
    return this.configService.get('defaultLanguageLocale') ?? englishUsa.code;
  }
}
