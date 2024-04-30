module.exports = function () {
  return {
    envPrefix: process.env.ENV_PREFIX,
    loadedEnvironment: process.env.ENV_LOADED,
    app: {
      port: process.env.PORT,
    },
    dbConfig: {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      logging: process.env.POSTGRES_LOGGING === 'true' || false,
      ssl: process.env.POSTGRES_SSL === 'true' || false,
      maxQueryExecutionTime: process.env.POSTGRES_MAX_QUERY_EXECUTION_TIME,
      connectTimeoutMS: process.env.POSTGRES_CONNECT_TIMEOUT_MS,
      connectionPoolSize: process.env.POSTGRES_CONNECTION_POOL_SIZE,
    },
    appInsights: {
      enabled: process.env.AZURE_APPLICATION_INSIGHTS_ENABLED === 'true' || false,
      instrumentation_key: process.env.AZURE_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY,
    },
    authConfig: {
      AzureIdp: {
        tenantName: process.env.AZURE_IDP_TENANT_NAME,
        signInUserFlow: process.env.AZURE_IDP_SIGNIN_USER_FLOW,
        issuerId: process.env.AZURE_IDP_ISSUER_ID,
      },
    },
    azureStorageConfig: {
      blobConnectionString: process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING,
      storageUrl: process.env.AZURE_STORAGE_STORAGE_URL,
    },
    azureCognitiveSearch: {
      name: process.env.AZURE_COGNITIVE_SEARCH_NAME,
      apiVersion: process.env.AZURE_COGNITIVE_SEARCH_API_VERSION,
      adminKey: process.env.AZURE_COGNITIVE_SEARCH_ADMIN_KEY,
      queryKey: process.env.AZURE_COGNITIVE_SEARCH_QUERY_KEY,
    },
    infoSystemIntegration: {
      eventsEnabled: process.env.INFO_INTEGRATION_EVENTS_ENABLED === 'true' || false,
      eventLogsEnabled: process.env.INFO_INTEGRATION_EVENT_LOGS_ENABLED === 'true' || false,
      eventsConnectionString: process.env.INFO_INTEGRATION_EVENTS_CONNECTION_STRING,
      eventsTopic: process.env.INFO_INTEGRATION_EVENTS_TOPIC,
      eventsSubscription: process.env.INFO_INTEGRATION_EVENTS_SUBSCRIPTION,
      commandsEnabled: process.env.INFO_INTEGRATION_COMMANDS_ENABLED === 'true' || false,
      commandsConnectionString: process.env.INFO_INTEGRATION_COMMANDS_CONNECTION_STRING,
      commandsTopic: process.env.INFO_INTEGRATION_COMMANDS_TOPIC,
      commandsSubscription: process.env.INFO_INTEGRATION_COMMANDS_SUBSCRIPTION,
      outputTopic: process.env.INFO_INTEGRATION_COMMANDOUTPUT_TOPIC,
      outputSubscription: process.env.INFO_INTEGRATION_COMMANDOUTPUT_SUBSCRIPTION,
      errorTopic: process.env.INFO_INTEGRATION_COMMANDERRORS_TOPIC,
      errorSubscription: process.env.INFO_INTEGRATION_COMMANDERRORS_SUBSCRIPTION,
    },
    emailQueue: {
      enabled: process.env.EMAIL_QUEUE_EVENTS_ENABLED === 'true' || false,
      connectionString: process.env.EMAIL_QUEUE_EVENTS_CONNECTION_STRING,
      queueName: process.env.EMAIL_QUEUE_NAME,
    },
    clientAccessEvents: {
      eventsEnabled: process.env.CLIENT_ACCESS_EVENTS_ENABLED === 'true' || false,
      eventsConnectionString: process.env.CLIENT_ACCESS_EVENTS_CONNECTION_STRING,
      eventsTopic: process.env.CLIENT_ACCESS_EVENTS_TOPIC,
    },
    notificationSenderConfig: {
      sendgridApiKey: process.env.SENDGRID_API_KEY, // TODO: Deprecated, to be removed once we turn off Sendgrid completely
      verifiedEmailUsedToSendMails: process.env.SENDGRID_SENDER, // TODO: Deprecated, to be removed once we turn off Sendgrid completely
      mmmHubApiBaseUrl: process.env.MMMHUB_API_BASE_URL,
      mmmHubApiSubscriptionKey: process.env.MMMHUB_API_SUBSCRIPTION_KEY,
    },
    //the template name must match the text of NotificationEventType in notificationEventType.enum.ts
    mailTemplates: [
      {
        name: 'userInvitation',
        id: 'd-b44bda51417144d1acd56e402e12d3e7',
      },
      {
        name: 'adminInvitation',
        id: 'd-0c01899051674635bf3aa2dd2fb59449',
      },
      {
        name: 'userAccountDisabledAdmins',
        id: 'd-32b2ae49317f4d07ac0225cb72bdd3fc',
      },
      {
        name: 'staffingRequestStatusChangedToInProgress',
        id: 'd-fbf834e8812940f5b54ec9a70237c0d8',
      },
      {
        name: 'staffingRequestStatusPartial',
        id: 'd-eee34e16387c4ec08a03750c4c45c364',
      },
      {
        name: 'staffingRequestStatusChangedToSelection',
        id: 'd-5428c31d0fbb43aabaecf0c21de28fe2',
      },
      {
        name: 'staffingRequestStatusChangedToCovered',
        id: 'd-3d58bc9d13b74c3fb3f69ee241757e83',
      },
      {
        name: 'newInvoice',
        id: 'd-0c7d84e18aa04a5cb86025a6d41ca2cb',
      },
      {
        name: 'roleChangeToAdmin',
        id: 'd-77f6ff96849c4236a617c5e030588086',
      },
      {
        name: 'roleChangeToUser',
        id: 'd-af6631b3e43a4e88aaf0dd645a141f6b',
      },
      {
        name: 'setupUserPermissions',
        id: 'd-bd9cbd10f8104752a80d937d6b786519',
      },
      {
        name: 'newContractsToSign',
        id: 'd-4e816a17126b4965a3130da45637c0d8',
      },
      {
        name: 'caseClosed',
        id: 'd-2cd242d1398443a685065b414065c6e1',
      },
      {
        name: 'staffingRequestCandidateNotAvailable',
        id: 'd-17a3c35dc2584a2f973edef7a192b056',
      },
      {
        name: 'staffingRequestApproachingDueDate',
        id: 'd-50e6427b51f949d99f7c9c3e037a04df',
      },
    ],
    jobRoleTemplateService: {
      apimSubscriptionKey: process.env.JOB_TEMPLATE_SERVICE_RC_PRIVATE_KEY,
      recruiterEmail: process.env.JOB_TEMPLATE_SERVICE_RC_RECRUITER_EMAIL,
    },
    hostNameUrls: [
      {
        hostName: 'CLIENT_ACCESS',
        url: 'https://was-eur-ww-dev-clientaccessfe.azurewebsites.net/client/login',
      },
      {
        hostName: 'ONSITE',
        url: 'https://was-eur-ww-dev-onsitefe.azurewebsites.net',
      },
    ],
    personService: {
      url: process.env.PERSON_SERVICE_URL,
      apimSubscriptionKey: process.env.PERSON_SERVICE_APIM_SUBSCRIPTION_KEY,
      privateKey: process.env.PERSON_SERVICE_PRIVATE_KEY,
    },
    reportSender: {
      destinationEmail: 'reports@adeccogroup.com',
    },
    powerBi: {
      authenticationMode: process.env.POWERBI_AUTHENTICATION_MODE,
      authorityUri: process.env.POWERBI_AUTHORITY_URI,
      scope: process.env.POWERBI_SCOPE,
      apiUrl: process.env.POWERBI_API_URL,
      embedTokenApiUrl: process.env.POWERBI_EMBED_TOKEN_API_URL,
      reportInGroupApiUrl: process.env.POWERBI_REPORT_IN_GROUP_API_URL,
      clientId: process.env.POWERBI_CLIENT_ID,
      workspaceId: process.env.POWERBI_WORKSPACE_ID,
      reportId: process.env.POWERBI_REPORT_ID,
      pbiUsername: process.env.POWERBI_PBI_USERNAME,
      pbiPassword: process.env.POWERBI_PBI_PASSWORD,
      clientSecret: process.env.POWERBI_CLIENT_SECRET,
      tenantId: process.env.POWERBI_TENANT_ID,
    },
    aamBackend: {
      url: process.env.AAMBACKEND_URL,
      apimSubscriptionKey: process.env.AAMBACKEND_APIM_SUBSCRIPTION_KEY,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      accessKey: process.env.REDIS_KEY,
    },
    google: {
      apiKey: process.env.GOOGLE_MAPS_KEY,
    },
    transformations: {
      useCLPTransformations: process.env.USE_CLP_TRANSFORMATIONS === 'true' || false,
    },
    salesForceIntegration: {
      eventsEnabled: process.env.SALESFORCE_INTEGRATION_EVENTS_ENABLED === 'true' || false,
      eventLogsEnabled: process.env.SALESFORCE_INTEGRATION_EVENT_LOGS_ENABLED === 'true' || false,
      eventsConnectionString: process.env.SALESFORCE_INTEGRATION_EVENTS_CONNECTION_STRING,
      eventsTopic: process.env.SALESFORCE_INTEGRATION_EVENTS_TOPIC,
      eventsSubscription: process.env.SALESFORCE_INTEGRATION_EVENTS_SUBSCRIPTION,
      commandsEnabled: process.env.SALESFORCE_INTEGRATION_COMMANDS_ENABLED === 'true' || false,
      commandsConnectionString: process.env.SALESFORCE_INTEGRATION_COMMANDS_CONNECTION_STRING,
      commandsTopic: process.env.SALESFORCE_INTEGRATION_COMMANDS_TOPIC,
      commandsSubscription: process.env.SALESFORCE_INTEGRATION_COMMANDS_SUBSCRIPTION,
      outputTopic: process.env.SALESFORCE_INTEGRATION_COMMANDOUTPUT_TOPIC,
      outputSubscription: process.env.SALESFORCE_INTEGRATION_COMMANDOUTPUT_SUBSCRIPTION,
      errorTopic: process.env.SALESFORCE_INTEGRATION_COMMANDERRORS_TOPIC,
      errorSubscription: process.env.SALESFORCE_INTEGRATION_COMMANDERRORS_SUBSCRIPTION,
    },
    mmmHubEventCallback: {
      signatureKey: process.env.MMM_HUB_EVENT_CALLBACK_KEY,
    },
    elasticApm: {
      enabled: process.env.ELASTIC_APM_IS_ENABLED === 'true' || false,
      serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
      serverUrl: process.env.ELASTIC_APM_SERVER_URL,
      secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
      cloudProvider: process.env.ELASTIC_APM_CLOUD_PROVIDER,
      transactionSampleRate: process.env.ELASTIC_APM_TRANSACTION_SAMPLE_RATE,
    },
    nodeCache: {
      isEnabled: process.env.IS_NODE_CACHE_ENABLED === 'true' || false,
      cachedEntity: {
        availableWorkers: true,
        caseCategory: true,
        certification: true,
        closeReason: true,
        consent: true,
        department: true,
        departmentFunction: true,
        employmentType: true,
        featureConfiguration: true,
        jobRole: true,
        language: true,
        level: true,
        permission: true,
        rate: true,
        role: true,
        sector: true,
        serviceType: true,
        shift: true,
        status: true,
        type: true,
        workType: true,
      },
    },
    defaultLanguageLocale: process.env.DEFAULT_LANGUAGE_LOCALE,
  };
};
