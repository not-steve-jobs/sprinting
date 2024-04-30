import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {JobContactDto} from 'src/modules/tenantUserPermission/dto/jobContact.dto';
import {JobContactTypeEnum} from 'src/modules/tenantUserPermission/tenantUserPermission.enum';
import {User} from 'src/modules/user/user.entity';
import {CountryData} from 'src/seed/essential/data/country.data';

export const getUserById = (users: User[], userId): User => {
  return users.find((user: User) => user.id === userId);
};

export const getCountryId = (countries: CountryData[], countryCode3: string): string => {
  return countries.find(({code3}) => code3 === countryCode3)?.id;
};

export const getCountryCode = (countries: CountryData[], countryId: string): string => {
  return countries.find(({id}) => id === countryId)?.code;
};

export const getUserByEmail = (users: User[], email: string): User => {
  return users.find((user) => user.email === email);
};

export const getTenantUsersByUserId = (tenantUsers: TenantUser[], userId: string): TenantUser[] => {
  return tenantUsers.filter((tenantUser) => tenantUser.userId === userId);
};

export const getTenantUserLocationByTenantIdAndUserId = (
  tenantUserLocations: TenantUserLocation[],
  tenantId: number,
  userId: string,
): TenantUserLocation => {
  return tenantUserLocations.find((tenantUserLocation) => {
    return tenantUserLocation.tenantId === tenantId && tenantUserLocation.userId === userId;
  });
};

export const getTenantUserLocationsByTenantIdAndUserId = (
  tenantUserLocations: TenantUserLocation[],
  tenantId: number,
  userId: string,
): TenantUserLocation[] => {
  return tenantUserLocations.filter((tenantUserLocation) => {
    return tenantUserLocation.tenantId === tenantId && tenantUserLocation.userId === userId;
  });
};

export const getTenantUserLocationIds = (tenantUserLocations: TenantUserLocation[]): string[] => {
  return tenantUserLocations.map((tenantUserLocation) => tenantUserLocation.locationId);
};

export const filterTimeSheetApproverJobContacts = (jobContacts: JobContactDto[]): JobContactDto[] => {
  return filterJobContactsByPermission(jobContacts, JobContactTypeEnum.TimeSheetApprover);
};

export const filterBillToJobContacts = (jobContacts: JobContactDto[]): JobContactDto[] => {
  return filterJobContactsByPermission(jobContacts, JobContactTypeEnum.BillTo);
};

export const filterReportToJobContacts = (jobContacts: JobContactDto[]): JobContactDto[] => {
  return filterJobContactsByPermission(jobContacts, JobContactTypeEnum.ReportTo);
};

export const filterJobContactsByPermission = (
  jobContacts: JobContactDto[],
  permission: JobContactTypeEnum,
): JobContactDto[] => {
  return jobContacts.filter((jobContact) => {
    return jobContact.permissions.includes(permission);
  });
};

export const parseUuid = (uuid: string): number => {
  return Number(uuid.substring(24, uuid.length));
};
