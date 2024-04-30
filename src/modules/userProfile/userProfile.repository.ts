import {AbstractRepository, EntityRepository} from 'typeorm';
import {UserProfile} from './userProfile.entity';
import {User} from '../user/user.entity';
import {Location} from '../location/location.entity';
import {UserProfileDto} from './dto/userProfile.dto';
import {Department} from '../department/department.entity';
import {DepartmentFunction} from '../departmentFunction/departmentFunction.entity';

@EntityRepository(UserProfile)
export class UserProfileRepository extends AbstractRepository<UserProfile> {
  public async findOne(id: string): Promise<UserProfile> {
    return this.createQueryBuilder('UserProfile').where('"UserProfile"."id" = :id', {id}).getOne();
  }

  /**
   * Retrieves UserProfile entities by given ids from the database.
   *
   * @param {string[]} ids - User ids to use for filtering
   * @returns {Promise<UserProfile[]>} - Promise, retrieving user profiles
   */
  public async findMany(ids: string[]): Promise<UserProfile[]> {
    return this.createQueryBuilder('UserProfile').where('"id" IN (:...ids)', {ids}).getMany();
  }

  public async findByExternalContactId(externalContactId: string): Promise<UserProfile> {
    return this.createQueryBuilder('UserProfile')
      .where('"externalContactId" = :externalContactId', {externalContactId})
      .getOne();
  }

  public async findOneWithUser(userId: string): Promise<UserProfileDto> {
    return this.createQueryBuilder('UserProfile')
      .where('"User"."id" = :userId', {userId})
      .leftJoinAndMapOne('UserProfile.user', User, 'User', 'User.id=UserProfile.id')
      .leftJoinAndMapOne('UserProfile.mainLocation', Location, 'Location', 'Location.id=UserProfile.mainLocationId')
      .leftJoinAndMapOne('UserProfile.department', Department, 'Department', 'Department.id=UserProfile.departmentId')
      .leftJoinAndMapOne(
        'UserProfile.departmentFunction',
        DepartmentFunction,
        'DepartmentFunction',
        'DepartmentFunction.id=UserProfile.departmentFunctionId',
      )
      .getOne();
  }

  /**
   * Find user profile with possibility to gether other relations
   *
   * @param {string} userId
   * @param {string[]} [relations=[]] - ['user', 'user.client', user.client.clientProfile]
   * @return {*}  {Promise<UserProfile>}
   * @memberof UserProfileRepository
   */
  public async findOneWithRelations(userId: string, relations: string[] = []): Promise<UserProfile> {
    return this.manager.findOne(UserProfile, {
      where: {id: userId},
      relations,
    });
  }

  public async save(entity: UserProfile) {
    return await this.manager.save(entity);
  }

  public async delete(entity: UserProfile) {
    return this.manager.remove(entity);
  }

  public async deleteMultiple(userIds: string[]) {
    return userIds.length
      ? this.createQueryBuilder('UserProfile').andWhere('id IN (:...userIds)', {userIds}).delete().execute()
      : '';
  }
}
