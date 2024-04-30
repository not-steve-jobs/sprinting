import {Connection} from 'typeorm';

import {ClientProfile} from 'src/modules/clientProfile/clientProfile.entity';
import {ClientProfileRepository} from 'src/modules/clientProfile/clientProfile.repository';
import {ClientProfileDto} from 'src/modules/clientProfile/dto/clientProfile.dto';

import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {Stopwatch} from 'src/seed/utils/stopwatch';

/**
 * Seed demo data for the Client Profiles
 *
 * @param {Connection} db - The active connection with the database
 * @param {ClientProfileDto[]} clientProfileData - The demo data which should be seeded
 * @returns {Promise<ClientProfile[]>} - A list with all of the seeded records
 */
export const seedClientProfilesData = async (
  db: Connection,
  clientProfileData: ClientProfileDto[],
): Promise<ClientProfile[]> => {
  log('Seeding Client Profiles', 3);
  const stopwatch = new Stopwatch();

  const createdClientProfiles: ClientProfile[] = await Promise.all(
    clientProfileData.map(async (data: ClientProfileDto) => {
      return seedClientProfile(db, data);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdClientProfiles.length}`);
  return createdClientProfiles;
};

/**
 * Seed demo data for a Client Profile
 *
 * @param {Connection} db - The active connection with the database
 * @param {ClientProfileDto} clientProfileData - The demo data which should be seeded
 * @returns {Promise<ClientProfile>} - A list with all of the seeded records
 */
const seedClientProfile = async (db: Connection, clientProfileData: ClientProfileDto): Promise<ClientProfile> => {
  const isDebug = isDebugMode();
  const clientProfileRepository: ClientProfileRepository = db.getCustomRepository(ClientProfileRepository);

  let clientProfile: ClientProfile = await clientProfileRepository.findOne(clientProfileData.id);
  if (clientProfile) {
    return clientProfile;
  }

  clientProfile = new ClientProfile();
  Object.assign(clientProfile, clientProfileData);

  logSuccess(`+ Seed ClientProfile [#${clientProfile.id}] ${clientProfile.businessName}`, 4, isDebug);
  return clientProfileRepository.save(clientProfile);
};
