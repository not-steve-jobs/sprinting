import {CaseCategoryDatabaseHelper} from '../caseCategories/seed';
import {CaseDatabaseHelper} from '../cases/seed';
import {LocationDatabaseHelper} from '../locations/seed';
import {StatusDatabaseHelper} from '../status/seed';

import {testCase} from '../cases/data';
import {testCaseCategory} from '../caseCategories/data';
import {testStatusesData} from '../status/data';
import {testLocations} from '../locations/data';
import {testClients} from '../clients/data';
import {testPermissions} from '../permissions/data';
import {testClientProfile} from '../clientProfile/data';
import {testClientConfiguration} from '../clientConfiguration/data';
import {ClientDatabaseHelper} from '../clients/seed';
import {CaseCommentDatabaseHelper} from '../caseComments/seed';
import {testCaseComment} from '../caseComments/data';
import {RoleDatabaseHelper} from '../role/seed';
import {testFeatureConfigurations} from '../featureConfiguration/data';
import {FeatureConfigurationDatabaseHelper} from '../featureConfiguration/seed';
import {ClientProfileDatabaseHelper} from '../clientProfile/seed';
import {ClientConfigurationDatabaseHelper} from '../clientConfiguration/seed';
import {BusMessageDatabaseHelper} from '../busMessage/seed';
import {UserDatabaseHelper} from '../users/seed';
import {testUser} from '../users/data';
import {TenantDatabaseHelper} from '../tenant/seed';
import {testTenant} from '../tenant/data';
import {testCountry} from '../country/data';
import {CountryDatabaseHelper} from '../country/seed';
import {TenantUserDatabaseHelper} from '../tenantUser/seed';
import {testTenantUser} from '../tenantUser/data';
import {TenantUserLocationDatabaseHelper} from '../tenantUserLocation/seed';
import {TenantUserPermissionDatabaseHelper} from '../tenantUserPermission/seed';
import {testTenantUserLocation} from '../tenantUserLocation/data';
import {testTenantUserPermissions} from '../tenantUserPermission/data';
import {testDepartments} from '../department/data';
import {testDepartmentFunctions} from '../departmentFunction/data';
import {testUserProfile} from '../userProfile/data';
import {DepartmentDatabaseHelper} from '../department/seed';
import {DepartmentFunctionDatabaseHelper} from '../departmentFunction/seed';
import {UserProfileDatabaseHelper} from '../userProfile/seed';
import {testCloseReasons} from '../closeReason/data';
import {PermissionDatabaseHelper} from '../permissions/seed';
import {CloseReasonDatabaseHelper} from '../closeReason/seed';
import {getTenantUserLocationPrimaryKeys} from '../tenantUserLocation/utils';
import {getTestTenantUserPermissionsPrimaryKeys} from '../tenantUserPermission/utils';
import {getTenantUserPrimaryKeys} from '../tenantUser/utils';
import {getTestCloseReasonsPrimaryKeys} from '../closeReason/utils';
import {getTestStatusesPrimaryKeys} from '../status/utils';
import {getTestDepartmentsPrimaryKeys} from '../department/utils';
import {getTestDepartmentFunctionsPrimaryKeys} from '../departmentFunction/utils';
import {getTestPermissionsPrimaryKeys} from '../permissions/utils';
import {getTestClientsPrimaryKeys} from '../clients/utils';
import {getTestLocationsPrimaryKeys} from '../locations/utils';
import {getTestFeatureConfigurationsPrimaryKeys} from '../featureConfiguration/utils';

export interface DatabaseHelper {
  seed(): Promise<void>;
  prepareCleanup?(): void;
  cleanup(ids?: number[] | string[] | Record<string, string | number>[]): Promise<void>;
}

export class MainDatabaseHelper implements DatabaseHelper {
  private departmentDatabaseHelper: DatabaseHelper;
  private departmentFunctionDatabaseHelper: DatabaseHelper;

  private countryDatabaseHelper: DatabaseHelper;
  private tenantDatabaseHelper: DatabaseHelper;
  private tenantUserDatabaseHelper: DatabaseHelper;

  private tenantUserLocationDatabaseHelper: DatabaseHelper;
  private tenantUserPermissionDatabaseHelper: DatabaseHelper;

  private clientDatabaseHelper: DatabaseHelper;
  private clientProfileDatabaseHelper: DatabaseHelper;
  private clientConfigurationDatabaseHelper: DatabaseHelper;
  private locationDatabaseHelper: DatabaseHelper;
  private statusDatabaseHelper: DatabaseHelper;
  private caseDatabaseHelper: DatabaseHelper;
  private caseCategoryDatabaseHelper: DatabaseHelper;
  private caseCommentDatabaseHelper: DatabaseHelper;
  private roleDatabaseHelper: DatabaseHelper;
  private closeReasonDatabaseHelper: DatabaseHelper;
  private permissionDatabaseHelper: DatabaseHelper;
  private featureConfigurationDatabaseHelper: DatabaseHelper;
  private busMessageDatabaseHelper: DatabaseHelper;
  private userDatabaseHelper: DatabaseHelper;
  private userProfileDatabaseHelper: DatabaseHelper;

  private createdRecords = {};

  constructor() {
    this.departmentDatabaseHelper = new DepartmentDatabaseHelper();
    this.departmentFunctionDatabaseHelper = new DepartmentFunctionDatabaseHelper();

    this.countryDatabaseHelper = new CountryDatabaseHelper();
    this.tenantDatabaseHelper = new TenantDatabaseHelper();
    this.tenantUserDatabaseHelper = new TenantUserDatabaseHelper();
    this.permissionDatabaseHelper = new PermissionDatabaseHelper();

    this.tenantUserLocationDatabaseHelper = new TenantUserLocationDatabaseHelper();
    this.tenantUserPermissionDatabaseHelper = new TenantUserPermissionDatabaseHelper();

    this.clientDatabaseHelper = new ClientDatabaseHelper();
    this.clientProfileDatabaseHelper = new ClientProfileDatabaseHelper();
    this.clientConfigurationDatabaseHelper = new ClientConfigurationDatabaseHelper();
    this.locationDatabaseHelper = new LocationDatabaseHelper();
    this.statusDatabaseHelper = new StatusDatabaseHelper();
    this.caseDatabaseHelper = new CaseDatabaseHelper();
    this.caseCategoryDatabaseHelper = new CaseCategoryDatabaseHelper();
    this.caseCommentDatabaseHelper = new CaseCommentDatabaseHelper();
    this.roleDatabaseHelper = new RoleDatabaseHelper();
    this.closeReasonDatabaseHelper = new CloseReasonDatabaseHelper();
    this.featureConfigurationDatabaseHelper = new FeatureConfigurationDatabaseHelper();
    this.busMessageDatabaseHelper = new BusMessageDatabaseHelper();
    this.userDatabaseHelper = new UserDatabaseHelper();
    this.userProfileDatabaseHelper = new UserProfileDatabaseHelper();
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific records to all of the tables
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public async seed(): Promise<void> {
    await this.departmentDatabaseHelper.seed();
    await this.departmentFunctionDatabaseHelper.seed();

    await this.countryDatabaseHelper.seed();
    await this.roleDatabaseHelper.seed();

    await this.tenantDatabaseHelper.seed();

    await this.closeReasonDatabaseHelper.seed();
    await this.clientDatabaseHelper.seed();
    await this.clientProfileDatabaseHelper.seed();
    await this.clientConfigurationDatabaseHelper.seed();

    await this.permissionDatabaseHelper.seed();
    await this.statusDatabaseHelper.seed();
    await this.locationDatabaseHelper.seed();

    await this.featureConfigurationDatabaseHelper.seed();

    await this.userDatabaseHelper.seed();
    await this.userProfileDatabaseHelper.seed();
    await this.tenantUserDatabaseHelper.seed();
    // TODO: Fix those seeds, the data is incorrect and causes issues
    // await this.tenantUserPermissionDatabaseHelper.seed();
    // await this.tenantUserLocationDatabaseHelper.seed();

    await this.caseCategoryDatabaseHelper.seed();
    await this.caseDatabaseHelper.seed();
    await this.caseCommentDatabaseHelper.seed();
    await this.busMessageDatabaseHelper.seed();
  }

  /**
   * Describe all of the entities which have been created by the seed and should be removed
   * from the database when the execution of the e2e tests finishes
   *
   */
  public prepareCleanup(): void {
    this.addCreatedRecord('TenantUserLocation', getTenantUserLocationPrimaryKeys(testTenantUserLocation));
    this.addCreatedRecords('TenantUserPermission', getTestTenantUserPermissionsPrimaryKeys(testTenantUserPermissions));

    this.addCreatedRecord('Country', testCountry.id);
    this.addCreatedRecord('TenantUser', getTenantUserPrimaryKeys(testTenantUser));
    this.addCreatedRecord('UserProfile', testUserProfile.id);
    this.addCreatedRecord('User', testUser.id);

    this.addCreatedRecords('Department', getTestDepartmentsPrimaryKeys(testDepartments));
    this.addCreatedRecords('DepartmentFunction', getTestDepartmentFunctionsPrimaryKeys(testDepartmentFunctions));

    this.addCreatedRecords('FeatureConfiguration', getTestFeatureConfigurationsPrimaryKeys(testFeatureConfigurations));
    this.addCreatedRecords('Permission', getTestPermissionsPrimaryKeys(testPermissions));

    // this.addCreatedRecords('Role', getTestRolesPrimaryKeys(testRoleData)); TODO: Enable this once #2726 is resolved

    this.addCreatedRecords('Client', getTestClientsPrimaryKeys(testClients));
    this.addCreatedRecord('ClientProfile', testClientProfile.id);
    this.addCreatedRecord('ClientConfiguration', testClientConfiguration.id);
    this.addCreatedRecords('Location', getTestLocationsPrimaryKeys(testLocations));

    this.addCreatedRecords('Status', getTestStatusesPrimaryKeys(testStatusesData));

    this.addCreatedRecord('Tenant', testTenant.id);

    this.addCreatedRecord('CaseCategory', testCaseCategory.id);
    this.addCreatedRecord('Case', testCase.id);
    this.addCreatedRecord('CaseComment', testCaseComment.id);

    this.addCreatedRecords('CloseReason', getTestCloseReasonsPrimaryKeys(testCloseReasons));
  }

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public async cleanup(): Promise<void> {
    await this.featureConfigurationDatabaseHelper.cleanup(this.createdRecords['FeatureConfiguration']);
    await this.closeReasonDatabaseHelper.cleanup(this.createdRecords['CloseReason']);
    await this.permissionDatabaseHelper.cleanup(this.createdRecords['Permission']);
    await this.caseCommentDatabaseHelper.cleanup(this.createdRecords['CaseComment']);
    await this.caseDatabaseHelper.cleanup(this.createdRecords['Case']);
    await this.caseCategoryDatabaseHelper.cleanup(this.createdRecords['CaseCategory']);

    // TODO: Enable back once the data is fixed and the seeds start to run again
    // await this.tenantUserLocationDatabaseHelper.cleanup(this.createdRecords['TenantUserLocation']);
    // await this.tenantUserPermissionDatabaseHelper.cleanup(this.createdRecords['TenantUserPermission']);
    await this.tenantUserDatabaseHelper.cleanup(this.createdRecords['TenantUser']);
    await this.userProfileDatabaseHelper.cleanup(this.createdRecords['UserProfile']);
    await this.userDatabaseHelper.cleanup(this.createdRecords['User']);

    await this.permissionDatabaseHelper.cleanup(this.createdRecords['Permission']);

    await this.roleDatabaseHelper.cleanup(this.createdRecords['Role']);

    await this.statusDatabaseHelper.cleanup(this.createdRecords['Status']);
    await this.locationDatabaseHelper.cleanup(this.createdRecords['Location']);

    await this.clientConfigurationDatabaseHelper.cleanup(this.createdRecords['ClientConfiguration']);
    await this.clientProfileDatabaseHelper.cleanup(this.createdRecords['ClientProfile']);
    await this.clientDatabaseHelper.cleanup(this.createdRecords['Client']);

    await this.departmentFunctionDatabaseHelper.cleanup(this.createdRecords['DepartmentFunction']);
    await this.departmentDatabaseHelper.cleanup(this.createdRecords['Department']);

    await this.busMessageDatabaseHelper.cleanup(this.createdRecords['BusMessage']);

    await this.tenantDatabaseHelper.cleanup(this.createdRecords['Tenant']);
    await this.countryDatabaseHelper.cleanup(this.createdRecords['Country']);
  }

  /**
   * Add a new item to the list with the created records so we can cleanup the database after the execution of all tests
   *
   * @param {string} entityName - The Type of the entity so we'll know where to keep it so it can be processed to the correct repository later
   * @param {number | string | Record<string, string | number>} entity - The ID or the pair of keys of the entity we want to keep
   */
  public addCreatedRecord(entityName: string, entity: string | number | Record<string, string | number>): void {
    if (!this.createdRecords[entityName]) {
      this.createdRecords[entityName] = [];
    }

    this.createdRecords[entityName].push(entity);
  }

  /**
   * Add a new items to the list with the created records so we can cleanup the database after the execution of all tests
   *
   * @param {string} entityName - The Type of the entity so we'll know where to keep it so it can be processed to the correct repository later
   * @param {any[]} entityArr - The entities array
   */
  public addCreatedRecords<T extends {[key in string]: string | number}>(entityName: string, entities: T[]): void {
    entities.forEach((entity) => {
      if (entity.id) {
        this.addCreatedRecord(`${entityName}`, entity.id);
      } else {
        this.addCreatedRecord(`${entityName}`, entity);
      }
    });
  }
}
