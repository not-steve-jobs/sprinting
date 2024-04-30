import {createConnection} from 'typeorm';
import config from '../../ormconfig.js';
import {Tenant} from '../modules/tenant/tenant.entity';
// import {LocationRepository} from '../modules/location/location.repository';
import {HttpService} from '@nestjs/common';
import {AppConfigService} from '../core/config/appConfig.service';
import {ConfigService} from '@nestjs/config';
import {AzureCognitiveSearchService} from '../modules/azureCognitiveSearch/azureCognitiveSearch.service';
import {AzureCognitiveSearchIndex} from '../modules/azureCognitiveSearch/azureCognitiveSearchIndex.enum';
import {DocumentAction} from '../modules/azureCognitiveSearch/documentAction.enum';
// import {CertificationRepository} from '../modules/certification/certification.repository';
// import {JobRoleRepository} from '../modules/jobRole/jobRole.repository';
import {TenantUser} from '../modules/tenantUser/tenantUser.entity';

interface IndexInfo {
  index: AzureCognitiveSearchIndex;
  getData: (connection) => any;
}

const initDbConnection = async () => {
  const dbConfig = Object.assign(config, {
    // Need to fix the path
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  });
  // Need to remove migrations
  delete dbConfig.migrations;
  // Init DB connection
  return createConnection(dbConfig);
};

const initAzureCognitiveSearchService = async () => {
  const envConfig = await import(`../../config/${process.env.NODE_ENV}`);
  const configService = new ConfigService(envConfig.default());
  const appConfigService = new AppConfigService(configService);
  const httpService = new HttpService();

  return new AzureCognitiveSearchService(appConfigService, httpService);
};

const getTenants = (connection) => connection.manager.find(Tenant);

const seedIndex = async (
  connection,
  azureCognitiveSearchService: AzureCognitiveSearchService,
  tenantId: number,
  indexInfo: IndexInfo,
) => {
  const indexName = azureCognitiveSearchService.getIndexNameForTenant(indexInfo.index, tenantId);

  const data = await indexInfo.getData(connection);

  // Delete and Recreate indexes
  const exists = await azureCognitiveSearchService.checkIndexExists(indexName);

  if (exists) {
    await azureCognitiveSearchService.deleteIndex(indexName);
  }

  await azureCognitiveSearchService.createIndexIfNotExists(indexInfo.index, tenantId);

  // Populate data
  await azureCognitiveSearchService.postData(indexName, DocumentAction.MERGE_OR_UPLOAD, data);
};

const start = async () => {
  const connection = await initDbConnection();
  // eslint-disable-next-line no-console
  console.log({connection});
  const azureCognitiveSearchService = await initAzureCognitiveSearchService();

  const tenants = await getTenants(connection);

  // Reset ACS indexes
  for (const {id: tenantId} of tenants) {
    // Configure what to seed
    const indexesToReset: Array<IndexInfo> = [
      // {
      //   index: AzureCognitiveSearchIndex.CERTIFICATIONS,
      //   getData: async (connection) => {
      //     const repo = connection.getCustomRepository(CertificationRepository) as CertificationRepository;

      //     const entities = await repo.getTenantCertifications(tenantId);

      //     // eslint-disable-next-line no-console
      //     console.log({entities});
      //     return entities.map(({id, tenantId, name}) => ({
      //       id,
      //       tenantId,
      //       name,
      //     }));
      //   },
      // },
      /* {
        index: AzureCognitiveSearchIndex.DEPARTMENTS,
        getData: async (connection) => {
          const repo = connection.getRepository(ClientDepartment);

          const entities = await repo.find({
            where: [
              {
                tenantId,
              },
            ],
          });

          return entities.map(({id, tenantId, clientId, name}) => ({
            id,
            tenantId,
            clientId,
            name,
          }));
        },
      },
      {
        index: AzureCognitiveSearchIndex.FUNCTIONS,
        getData: async (connection) => {
          const repo = connection.getCustomRepository(FunctionRepository) as FunctionRepository;

          const entities = await repo.getTenantFunctions(tenantId);

          return entities.map(({id, name}) => ({
            id: `${id}`,
            tenantId,
            name,
          }));
        },
      }, */
      // {
      //   index: AzureCognitiveSearchIndex.JOBROLES,
      //   getData: async (connection) => {
      //     const repo = connection.getCustomRepository(JobRoleRepository) as JobRoleRepository;

      //     const entities = await repo.findAll(tenantId);

      //     return entities.map(({id, tenantId, name}) => ({id, tenantId, name}));
      //   },
      // },
      // {
      //   index: AzureCognitiveSearchIndex.LOCATIONS,
      //   getData: async (connection) => {
      //     const repo = connection.getCustomRepository(LocationRepository) as LocationRepository;

      //     const entities = await repo.findAll();
      //     // eslint-disable-next-line no-console
      //     console.log({entities});
      //     return entities.map(
      //       ({id, clientId, isMainLocation, locationName, street, number, city, state, country, zip, status}) => ({
      //         id,
      //         clientId,
      //         isMainLocation,
      //         locationName,
      //         street,
      //         number,
      //         city,
      //         state,
      //         country,
      //         zip,
      //         status,
      //       }),
      //     );
      //   },
      // },
      {
        index: AzureCognitiveSearchIndex.USERNAMES,
        getData: async (connection) => {
          const repo = connection.getRepository(TenantUser);

          const entities = (await repo.find({
            where: [
              {
                tenantId,
              },
            ],
            join: {
              alias: 'tenantUser',
              leftJoinAndSelect: {
                user: 'tenantUser.user',
                userProfile: 'user.userProfile',
              },
            },
          })) as Array<TenantUser>;
          // eslint-disable-next-line no-console
          console.log({entities});
          return entities.map(({user: {userProfile: {id, firstName, lastName}}}) => ({
            id,
            tenantId,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
          }));
        },
      },
    ];

    // Run for every index
    for (const indexInfo of indexesToReset) {
      await seedIndex(connection, azureCognitiveSearchService, tenantId, indexInfo);
    }
  }
};

start();
