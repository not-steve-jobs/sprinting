import {Connection} from 'typeorm';

import {User} from 'src/modules/user/user.entity';
import {SeedUserProfileDto} from 'src/modules/userProfile/dto/seedUserProfile.dto';
import {Location} from 'src/modules/location/location.entity';
import {UserProfile} from 'src/modules/userProfile/userProfile.entity';
import {UserProfileRepository} from 'src/modules/userProfile/userProfile.repository';
import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {departmentData} from 'src/seed/essential/data/department.data';
import {departmentFunctionData} from 'src/seed/essential/data/departmentFunction.data';
import {Stopwatch} from 'src/seed/utils/stopwatch';

import {getUserById} from '../user';
import {getRandomLocationByClient} from '../../locations';

/**
 * Seed demo data for the User Profiles
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedUserProfileDto[]} userProfilesData - The demo data which should be seeded
 * @param {User[]} users - List with the existing Users which should be used to link up with the UserProfiles
 * @param {Location[]} locations - List with the existing Locations which should be used to link up with the UserProfiles
 * @returns {Promise<UserProfile[]>} - A list with all of the seeded records
 */
export const seedUserProfiles = async (
  db: Connection,
  userProfilesData: SeedUserProfileDto[],
  users: User[],
  locations: Location[],
): Promise<UserProfile[]> => {
  log('Seeding User Profiles', 3);
  const stopwatch = new Stopwatch();

  const createdUserProfiles: UserProfile[] = await Promise.all(
    userProfilesData.map(async (userProfileData: SeedUserProfileDto) => {
      return await seedUserProfile(db, userProfileData, users, locations);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdUserProfiles.length}`);
  return createdUserProfiles;
};

/**
 * Seed demo data for a User Profile
 * TODO: Needs a bit more refactoring
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedUserProfileDto[]} userProfileData - The demo data which should be seeded
 * @param {User[]} users - List with the existing Users used to link up with the UserProfile
 * @param {Location[]} locations - List with the existing Locations used to link up with the UserProfile
 * @returns {Promise<UserProfile[]>}
 */
export const seedUserProfile = async (
  db: Connection,
  userProfileData: SeedUserProfileDto,
  users: User[],
  locations: Location[],
): Promise<UserProfile> => {
  const isDebug = isDebugMode();
  const userProfileRepository: UserProfileRepository = db.getCustomRepository(UserProfileRepository);

  let userProfile: UserProfile = await userProfileRepository.findOne(userProfileData.id);
  if (userProfile) {
    return userProfile;
  }

  userProfile = new UserProfile();

  // Not sure why and how, but for some reason the User may be messed and don't have a Client
  // I just moved this code here, I'm not the author so don't blame me later
  const user = getUserById(users, userProfileData.id);
  if (!user?.clientId) {
    return null;
  }

  const location: Location = getRandomLocationByClient(locations, user.clientId);
  if (location) {
    userProfileData.mainLocationId = location?.id;
  }

  // TODO: Don' use the departmentsData as global, import it as param to the function
  const rndDeptIdx = Math.floor(UtilsHelper.randomNumber() * departmentData.length);
  userProfileData.departmentId = departmentData[rndDeptIdx].id;
  if (departmentData[rndDeptIdx].name === 'Other') {
    userProfileData.customDepartment = 'Custom Department';
  }

  // TODO: Don' use the departmentsData as global, import it as param to the function
  const functionsMatchingDepartment = departmentFunctionData.filter(
    (f) => f.departmentId === userProfileData.departmentId,
  );
  const rndFnIdx = Math.floor(UtilsHelper.randomNumber() * functionsMatchingDepartment.length);
  userProfileData.departmentFunctionId = functionsMatchingDepartment[rndFnIdx].id;

  Object.assign(userProfile, userProfileData);

  logSuccess(`+ Seed UserProfile [#${userProfile.id}]`, 4, isDebug);
  return userProfileRepository.save(userProfile);
};
