import {Connection} from 'typeorm/connection/Connection';

import {UtilsHelper} from 'src/helpers/utils.helper';
import {Contract} from 'src/modules/contract/contract.entity';
import {Location} from 'src/modules/location/location.entity';
import {ContractRepository} from 'src/modules/contract/contract.repository';
import {ContractDto} from 'src/modules/contract/dto/contract.dto';

import {typeData} from 'src/seed/tenantSpecific/data/type.data';
import {SeedFeatures} from 'src/seed/tenantSpecific/data/seedFeatures.data';
import {tenantData, adeccoLux, adeccoPol} from 'src/seed/tenantSpecific/data/tenant.data';
import {
  intGuid,
  getRandomEntityStatus,
  getRandomIntIndex,
  shouldSeedTenantRelatedData,
  log,
  getLocationsByClient,
  logSuccess,
  isDebugMode,
} from 'src/seed/utils/seed.utils';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {generateRandomDate, zeroPad} from 'src/seed/utils/helpers';
import {UUIDSection} from 'src/seed/utils/uuidSection.enum';
import {DEMO_NAMES, DEMO_SERVICES, DEMO_SERVICE_TYPES} from './data';

/**
 * Seed demo data for the Contracts in the system
 * Note: We have to change this to ensure that we have seeded data for all tenant and users
 * Note: This is only refactored a bit, it's obvious that it needs more work in order to polish it
 *
 * @param {Connection} db - The active connection with the database
 * @param {Location[]} countries - List with all of the active Locations
 * @returns {Promise<Contract[]>} - A list with all of the seeded Contracts
 */
export const seedContracts = async (db: Connection, locations: Location[]): Promise<Contract[]> => {
  log('Seeding Contracts');
  const stopwatch = new Stopwatch();

  const contractData: ContractDto[] = generateContractsSeedData();
  const createdContracts: Contract[] = await Promise.all(
    contractData.map(async (data) => {
      return await seedContract(db, data, locations);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdContracts.length}`);
  return createdContracts;
};

/**
 * Seed demo data for a Contract
 * Note: Needs a bit more refactoring
 *
 * @param {Connection} db - The active connection with the database
 * @param {Location[]} locations - List with all of the active Locations
 * @returns {Promise<Contract>}
 */
export const seedContract = async (
  db: Connection,
  contractData: ContractDto,
  locations: Location[],
): Promise<Contract> => {
  const isDebug = isDebugMode();
  const contractRepository: ContractRepository = db.getCustomRepository(ContractRepository);

  let contract: Contract = await contractRepository.findOne(contractData.tenantId, contractData.id);
  if (contract) {
    return contract;
  }

  contract = new Contract();
  //generate random number of random locations witch are available for specific user
  //todo: does this location have to depend of client?
  const locationsForTenantAndClient = getLocationsByClient(locations);
  const randomLocationIndex = Math.floor(UtilsHelper.randomNumber() * (locationsForTenantAndClient.length - 1));
  const randomLocation = locationsForTenantAndClient[randomLocationIndex];

  Object.assign(contract, contractData);
  contract.locationId = randomLocation.id;

  logSuccess(`+ Seed Contract [#${contract.id}] ${contract.number}`, 3, isDebug);
  return await contractRepository.save(contract);
};

/**
 * Generate some demo Contracts data
 * Note: Needs a bit more refactoring, now I just moved it here
 *
 * @returns {ContractDto[]} - Generated details for Contracts
 */
export const generateContractsSeedData = (): ContractDto[] => {
  const contractData: ContractDto[] = [];

  // TODO: Add the tenantData as input param
  tenantData.forEach((tenant) => {
    if (!shouldSeedTenantRelatedData(tenant, SeedFeatures.Contracts)) {
      return;
    }
    const tenantId = tenant.id;

    for (let i = 1; i <= 20; i++) {
      // TODO: Move the generation of a single Contract as a separate function
      const contractBase = {
        number: `W912HN-C${zeroPad(i, 3)}`,
        // location: locationNames[Math.floor(UtilsHelper.randomNumber() * locationNames.length)],
        dateStart: generateRandomDate(new Date(2012, 0, 1), new Date()),
        dateEnd: generateRandomDate(new Date(2012, 0, 1), new Date()),
        signatureDate: generateRandomDate(new Date(2012, 0, 1), new Date()),
        statusId: getRandomEntityStatus(tenantId, Contract.name),
      };

      const types = typeData.filter(({tenantId: typeTenantId}) => typeTenantId === tenantId);
      const contractLux =
        tenantId === adeccoLux.id
          ? {
              associateName: DEMO_NAMES[Math.floor(UtilsHelper.randomNumber() * DEMO_NAMES.length)],
              typeId: types[getRandomIntIndex(types.length)].id,
              service: DEMO_SERVICES[Math.floor(UtilsHelper.randomNumber() * DEMO_SERVICES.length)],
            }
          : {};
      const contractPol =
        tenantId === adeccoPol.id
          ? {
              legalEntity: '-',
              signedBy: DEMO_NAMES[Math.floor(UtilsHelper.randomNumber() * DEMO_NAMES.length)],
              serviceType: DEMO_SERVICE_TYPES[Math.floor(UtilsHelper.randomNumber() * DEMO_SERVICE_TYPES.length)],
              roleOfThePersonSign: 'role?',
              clientsName: DEMO_NAMES[1 - Math.floor(UtilsHelper.randomNumber() * DEMO_NAMES.length)],
              VAT: 'VAT?',
              mainPointOfContract: 'Main point of contract?',
              mainPointForInvoice: 'Main point for invoice?',
            }
          : {};

      contractData.push({
        id: intGuid(tenantId * 10 + i, UUIDSection.Contracts),
        tenantId,
        // name: `Test client ${zeroPad(i, 3)}`, // Note: We don't have a name field in the database
        ...contractBase,
        ...contractLux,
        ...contractPol,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });

  return contractData;
};
