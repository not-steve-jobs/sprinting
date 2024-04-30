import {AuthRoles} from '../../core/auth/authRoles';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {User} from './user.entity';
import {FilteringOptions, Pagination, PaginationOptions, SortingOptions} from '../common/paginate';
import {UtilsHelper} from '../../helpers/utils.helper';
import {UserStatus} from '../status/status.enum';
import {TenantUserPermission} from '../tenantUserPermission/tenantUserPermission.entity';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  private q(): SelectQueryBuilder<User> {
    return this.createQueryBuilder('User');
  }

  public async findOne(id: string, relations: string[] = []): Promise<User> {
    return this.manager.findOne(User, {
      where: {id},
      relations,
    });
  }

  public async findOneByEmail(email: string, relations: string[] = []): Promise<User> {
    return this.manager.findOne(User, {
      where: {email},
      relations,
    });
  }

  public async findOneByB2CId(B2CId: string): Promise<User> {
    return this.manager.findOne(User, {where: {B2CId}});
  }

  public async save(entity: User) {
    return this.manager.save(entity);
  }

  public async delete(entity: User) {
    return this.manager.remove(entity);
  }

  public async deleteMultiple(userIds: string[]) {
    return userIds.length ? this.q().andWhere('id IN (:...userIds)', {userIds}).delete().execute() : '';
  }

  public async getMultiple(userIds: string[]) {
    return userIds.length ? this.q().andWhere('id IN (:...userIds)', {userIds}).getMany() : [];
  }

  public async fetchUsersWithPermission(
    tenantId: number,
    permission: string,
    locationId: string,
    hasNotificationEnabled?: boolean,
  ): Promise<User[]> {
    const queryUsersWithPermissions = this.q()
      .select(['User'])
      .leftJoin('User.userPermission', 'UserPermission')
      .leftJoin('UserPermission.permission', 'Permission')
      .leftJoin('User.userLocation', 'UserLocation')
      .leftJoin('UserLocation.location', 'Location')
      .andWhere('"Permission"."name" = :permission', {permission})
      .andWhere('"UserLocation"."locationId" = :locationId', {locationId});

    if (hasNotificationEnabled) {
      queryUsersWithPermissions.andWhere('"User"."emailNotifications" = :hasNotificationEnabled', {
        hasNotificationEnabled,
      });
    }

    return await queryUsersWithPermissions.getMany();
  }

  public async fetchMyColleagues(
    tenantId: number,
    userId: string,
    clientId: string,
    countryId: string,
    isAdmin: boolean,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
  ): Promise<Pagination<any>> {
    const {findBetween, findIn} = filteringOptions.filter ?? {};
    /***
     * Because we have multiple joins and webKeys in feature configurations doesn't match
     * columns naming in database, we must map table by webKey and column also by webKey
     * P. S. orderDESCorASC is 'ASC' when sortingOptions.sort.key has value 'firstName'
     * because that is the default ordering (when the page loads for the first time)
     */
    const orderByTableAndColumn =
      UtilsHelper.getTableFromSortKey(sortingOptions.sort.key) +
      UtilsHelper.getColumnNameFromSortKey(sortingOptions.sort.key);
    const orderDESCorASC = UtilsHelper.getOrderDirection(sortingOptions);

    let query: any = this.q()
      .select([
        'TenantUser.tenantId',
        'User.id',
        'User.email',
        'User.clientId',
        'User.B2CId',
        'UserProfile.firstName',
        'UserProfile.lastName',
        'UserProfile.worksite',
        'UserProfile.profileImageUrl',
        'UserProfile.title',
        'UserProfile.departmentId',
        'UserProfile.departmentFunctionId',
        'UserProfile.customDepartment',
        'UserProfile.street',
        'UserProfile.street2',
        'UserProfile.city',
        'UserProfile.state',
        'UserProfile.country',
        'UserProfile.zip',
        'Location.id',
        'Location.locationName',
        'Location.street',
        'Location.number',
        'Location.zip',
        'Location.city',
        'Client.id',
        'Client.name',
        'Role.name',
        'Status.name',
        'Status.tenant',
        'TenantUserPermission.tenantId',
        'TenantUserPermission.permissionId',
        'TenantUserPermission.userId',
        'Permission.id',
        'Permission.name',
        'TenantUserLocation.tenantId',
        'TenantUserLocation.locationId',
        'TenantUserLocation.userId',
        'TenantUserLocationLocation.locationName',
        'TenantUserLocationLocation.street',
        'TenantUserLocationLocation.number',
        'TenantUserLocationLocation.zip',
        'TenantUserLocationLocation.city',
        'Department.name',
        'DepartmentFunction.name',
      ])
      .addSelect('UPPER(COALESCE(UserProfile.customDepartment, Department.name))', 'department_name_coalesced')
      .andWhere('"User"."clientId" = :clientId', {clientId})
      .andWhere('"User"."id" != :id', {id: userId});

    query = UtilsHelper.applyFilter(findIn, findBetween, query);

    query = query
      .leftJoin('User.tenantUsers', 'TenantUser')
      .leftJoin('User.client', 'Client')
      .leftJoin('User.userProfile', 'UserProfile')
      .leftJoin('UserProfile.mainLocation', 'Location')
      .leftJoin('UserProfile.department', 'Department')
      .leftJoin('UserProfile.departmentFunction', 'DepartmentFunction')
      .leftJoin('TenantUser.role', 'Role')
      .leftJoinAndSelect('TenantUser.status', 'Status')
      .leftJoinAndSelect('Status.tenant', 'TenantStatus')
      .leftJoin('TenantUser.tenantUserPermissions', 'TenantUserPermission')
      .leftJoin('TenantUserPermission.permission', 'Permission')
      .leftJoin('TenantUser.tenantUserLocations', 'TenantUserLocation')
      .leftJoin('TenantUserLocation.location', 'TenantUserLocationLocation')
      .andWhere('"TenantStatus"."countryId" = :countryId', {countryId})
      .andWhere('Role.name IN (:...roleNames)', {roleNames: [AuthRoles.admin, AuthRoles.user]})
      .andWhere('"User"."inactive" = :inactive', {inactive: false})
      .take(paginatorOptions.itemsPerPage)
      .skip((paginatorOptions.page - 1) * paginatorOptions.itemsPerPage)
      .orderBy(orderByTableAndColumn, orderDESCorASC)
      .getManyAndCount();

    const [results, total] = await query;

    const newResult = results.map((user: any) => {
      const tenantUser = user.tenantUsers.find((tenantUser) => tenantUser.tenantId === tenantId);
      const userPermissions =
        tenantUser?.tenantUserPermissions?.map((tup: TenantUserPermission) => {
          return {
            id: tup.permission.id,
            name: tup.permission.name,
          };
        }) ?? [];
      const userLocationsIds = [];
      const userWorksites = [];
      tenantUser?.tenantUserLocations?.forEach((tul: any) => {
        const {locationName, street, number, city, zip} = tul.location;
        userLocationsIds.push(tul.locationId);
        userWorksites.push([`${locationName}\n${street}\n${number}\n${city}\n${zip}`]);
      });

      const commonProperties = {
        nameAndImage: {
          image: user.userProfile.profileImageUrl,
          name: `${user.userProfile.firstName} ${user.userProfile.lastName}`,
        },
        id: user.id,
        clientId: user.clientId,
        tenantId: tenantUser?.tenantId ?? null,
        title: user.userProfile.title || '',
        userType: tenantUser
          ? tenantUser.role.name.charAt(0).toUpperCase() + tenantUser.role.name.slice(1)
          : AuthRoles.user,
        mainLocationId: user?.userProfile?.mainLocation?.id,
        mainLocation: user?.userProfile?.mainLocation?.locationName,
        departmentId: user.userProfile.departmentId,
        department:
          user.userProfile.department && user.userProfile.department.name ? user.userProfile.department.name : '-',
        functionId: user.userProfile.departmentFunctionId,
        function:
          user.userProfile.departmentFunction && user.userProfile.departmentFunction.name
            ? user.userProfile.departmentFunction.name
            : '-',
        customDepartment: user.userProfile.customDepartment,
        street: user.userProfile.street,
        street2: user.userProfile.street2,
        city: user.userProfile.city,
        state: user.userProfile.state,
        country: user.userProfile.country,
        zip: user.userProfile.zip,
      };

      // return value depends of the user role
      return isAdmin
        ? {
            ...commonProperties,
            firstName: user.userProfile.firstName,
            lastName: user.userProfile.lastName,
            email: user.email,
            worksite: tenantUser && tenantUser.role.name !== AuthRoles.admin ? userWorksites : null,
            permissions: tenantUser && tenantUser.role.name !== AuthRoles.admin ? userPermissions : null,
            locations: userLocationsIds,
            status: tenantUser ? tenantUser.status.name : UserStatus.NotInvited,
            registerStatus: !!user.B2CId,
          }
        : {
            ...commonProperties,
          };
    });

    return new Pagination<any>({
      results: newResult,
      total,
    });
  }

  public async groupMyColleaguesByStatus(
    tenantId: number,
    userId: string,
    clientId: string,
    isAdmin: boolean,
    filteringOptions: FilteringOptions,
  ): Promise<any> {
    const {findBetween, findIn} = filteringOptions.filter ?? {};

    let query: any = this.q()
      .select(['Status.name AS status'])
      .addSelect('COUNT(DISTINCT User.id) AS count')
      .andWhere('"User"."clientId" = :clientId', {clientId})
      .andWhere('"User"."id" != :id', {id: userId});

    query = UtilsHelper.applyFilter(findIn, findBetween, query);

    query = query
      .leftJoin('User.tenantUsers', 'TenantUser')
      .leftJoin('User.client', 'Client')
      .leftJoin('User.userProfile', 'UserProfile')
      .leftJoin('UserProfile.mainLocation', 'Location')
      .leftJoin('UserProfile.department', 'Department')
      .leftJoin('UserProfile.departmentFunction', 'DepartmentFunction')
      .leftJoin('TenantUser.role', 'Role')
      .leftJoin('TenantUser.status', 'Status')
      .leftJoin('TenantUser.tenantUserPermissions', 'TenantUserPermission')
      .leftJoin('TenantUserPermission.permission', 'Permission')
      .leftJoin('TenantUser.tenantUserLocations', 'TenantUserLocation')
      .leftJoin('TenantUserLocation.location', 'TenantUserLocationLocation')
      .andWhere('Role.name IN (:...roleNames)', {roleNames: [AuthRoles.admin, AuthRoles.user]})
      .groupBy('Status.name')
      .getRawMany();

    const results = await query;

    return results;
  }

  public async getAllUserFirstAndLastNameDistinct(clientId: string): Promise<any[]> {
    return this.q()
      .select(['User.id', 'UserProfile.firstName AS firstName', 'UserProfile.lastName AS lastName'])
      .distinctOn(['firstName', 'lastName'])
      .orderBy({firstName: 'ASC', lastName: 'ASC'})
      .where('"User"."clientId" = :clientId', {clientId})
      .innerJoinAndSelect('User.userProfile', 'UserProfile')
      .getMany()
      .then((result) =>
        result.map((user) => {
          return {
            id: user.id,
            fullName: `${user.userProfile?.firstName} ${user.userProfile?.lastName}`,
          };
        }),
      );
  }
}
