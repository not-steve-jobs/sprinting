import {CaseCommentRepository} from './../src/modules/caseComment/caseComment.repository';
import {TenantUserPermissionRepository} from '../src/modules/tenantUserPermission/tenantUserPermission.repository';
import {TenantUserLocationRepository} from './../src/modules/tenantUserLocation/tenantUserLocation.repository';
import {UserRepository} from '../src/modules/user/user.repository';
import {UserProfileRepository} from '../src/modules/userProfile/userProfile.repository';
import {FixInterface} from 'src/modules/fix/fix.interface';
import {intGuid} from 'src/seed/utils/seed.utils';
import {TenantUserRepository} from 'src/modules/tenantUser/tenantUser.repository';
import {getConnection} from 'typeorm';
import {CaseRepository} from 'src/modules/case/case.repository';

export class RemoveSeededTestUsersFix1635510979000 implements FixInterface {
  public async execute(): Promise<any> {
    return await getConnection().transaction(async (tManager) => {
      const userProfileRepository = tManager.getCustomRepository(UserProfileRepository);
      const userRepository = tManager.getCustomRepository(UserRepository);
      const tenantUserRepository = tManager.getCustomRepository(TenantUserRepository);
      const tenantUserLocationRepository = tManager.getCustomRepository(TenantUserLocationRepository);
      const tenantUserPermissionRepository = tManager.getCustomRepository(TenantUserPermissionRepository);
      const caseRepository = tManager.getCustomRepository(CaseRepository);
      const caseCommentRepository = tManager.getCustomRepository(CaseCommentRepository);

      let userIds = [];
      // generate problematic UUIDs
      for (let i = 11; i <= 40; i++) {
        userIds.push(intGuid(i));
      }

      // get all users and filter them
      // some new users (for Roberto, Alison have matching UUIDs with old test users, so they should be skipped)
      const allUsers = await userRepository.getMultiple(userIds);
      userIds = [];
      allUsers.forEach((u) => {
        if (u.id.includes('4000') && u.email.includes('test+')) {
          userIds.push(u.id);
        }
      });

      // find all cases for some user and then find all comments for these cases
      let allCaseIds = [];
      for (let u = 0; u < userIds.length; u++) {
        const userId = userIds[u];
        const allUserCases = await caseRepository.getUserCases(userId);
        if ((allUserCases ?? []).length > 0) {
          allCaseIds = [...allCaseIds, ...allUserCases.map((c) => c.id)];
        }
      }

      await tenantUserLocationRepository.deleteMultiple(userIds);
      await tenantUserPermissionRepository.deleteMultiple(userIds);
      //cases
      await caseCommentRepository.deleteMultiple(allCaseIds);
      await caseRepository.deleteMultiple(userIds);

      await tenantUserRepository.deleteMultiple(userIds);
      await userProfileRepository.deleteMultiple(userIds);
      await userRepository.deleteMultiple(userIds);
    });
  }
}
