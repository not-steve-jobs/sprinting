import {WorkTypeRepository} from '../../modules/workType/workType.repository';
import {workTypeData} from './data/workType.data';
import {CloseReasonRepository} from '../../modules/closeReason/closeReason.repository';
import {generateCamelCaseFromText, isDebugMode, log, logSuccess, parseProcessingTime} from '../utils/seed.utils';
import {EmploymentTypeRepository} from '../../modules/employmentType/employmentType.repository';
import {PermissionRepository} from '../../modules/permission/permission.repository';
import {permissionData} from './data/permissions.data';
import {Connection, getConnection} from 'typeorm';
import {tenantData} from './data/tenant.data';
import {Tenant} from '../../modules/tenant/tenant.entity';
import {TenantRepository} from '../../modules/tenant/tenant.repository';
import {featureConfigurationData} from './featureConfiguration/featureConfiguration.seed';
import {FeatureConfigurationRepository} from '../../modules/featureConfiguration/featureConfiguration.repository';
import {FeatureConfiguration} from '../../modules/featureConfiguration/featureConfiguration.entity';
import {JobRoleRepository} from '../../modules/jobRole/jobRole.repository';
import {jobRoleData} from './data/jobRoleData.data';
import {statusData} from './data/status.data';
import {StatusRepository} from '../../modules/status/status.repository';
import {Status} from '../../modules/status/status.entity';
import {generateConsentSeedData} from './generators/consent.seed';
import {ConsentRepository} from '../../modules/consent/consent.repository';
import {Consent} from '../../modules/consent/consent.entity';
import {Permission} from '../../modules/permission/permission.entity';
import {ServiceTypeRepository} from '../../modules/serviceType/serviceType.repository';
import {serviceTypeData} from './data/serviceType.data';
import {ServiceType} from '../../modules/serviceType/serviceType.entity';
import {ShiftRepository} from '../../modules/shift/shift.repository';
import {shiftData} from './data/shift.data';
import {Shift} from '../../modules/shift/shift.entity';
import {RateRepository} from '../../modules/rate/rate.repository';
import {rateData} from './data/rate.data';
import {Rate} from '../../modules/rate/rate.entity';
import {SectorRepository} from '../../modules/sector/sector.repository';
import {sectorData} from './data/sector.data';
import {Sector} from '../../modules/sector/sector.entity';
import {LevelRepository} from '../../modules/level/level.repository';
import {CertificationRepository} from '../../modules/certification/certification.repository';
import {certificationData} from './data/certification.data';
import {Certification} from '../../modules/certification/certification.entity';
import {employmentTypeData} from './data/employmentType.data';
import {EmploymentType} from '../../modules/employmentType/employmentType.entity';
import {typeData} from './data/type.data';
import {TypeRepository} from '../../modules/type/type.repository';
import {Type} from '../../modules/type/type.entity';
import {InvitationUrl} from '../../modules/tenant/tenant.enum';
import {closeReasonData} from './data/closeReason.data';
import {CloseReason} from '../../modules/closeReason/closeReason.entity';
import {AvailableWorkersRepository} from '../../modules/availableWorkers/availableWorkers.repository';
import {availableWorkersData} from './generators/availableWorkers.seed';
import {AvailableWorkers} from '../../modules/availableWorkers/availableWorkers.entity';
import {JobRoleTemplateRepository} from '../../modules/jobRoleTemplate/jobRoleTemplate.repository';
import {jobRoleTemplateData} from './data/jobRoleTemplate.data';
import {JobRoleTemplate} from '../../modules/jobRoleTemplate/jobRoleTemplate.entity';
import {RegionRepository} from '../../modules/region/region.repository';
import {generateRegionData} from './generators/region.seed';
import {Region} from '../../modules/region/region.entity';
import {RegionWageRepository} from '../../modules/regionWage/regionWage.repository';
import {generateRegionWageData} from './generators/regionWage.seed';
import {RegionWage} from '../../modules/regionWage/regionWage.entity';
import JobRoleSeed from './generators/jobRole.seed';
import {WorkType} from 'src/modules/workType/workType.entity';
import {seedTransformations} from './transformations/seed';

/**
 * Seed base data which is required to make the system operational

 * @param {Connection} db - The active connection used for the communication with the DB
 * @param {string} envPrefix - Information for the env on which we currently perform the seeding
 * @returns - A simple promise to ensure that all of the action have been dispatched
 */
export async function tenantSpecificSeed(db: Connection, envPrefix: string) {
  console.log(`Seeding Tenant Specific Data`);
  const isDebug = isDebugMode();
  await SeedTenants(db, envPrefix, isDebug);
  await SeedStatuses(db);
  await SeedTypes(db);
  await SeedConsents(db);
  await SeedCloseReasons(db);
  await SeedServiceType(db);
  await SeedShift(db);
  await SeedRate(db);
  await SeedEmploymentType(db);
  await SeedSector(db);
  await SeedCertification(db);
  await SeedFeatureConfiguration(db);
  await SeedJobRole(db);
  await SeedPermissions(db);
  await SeedRegion(db);
  //not sure it's needed
  await SeedRegionPostalCode();
  const regionRepository = db.getCustomRepository(RegionRepository);
  const jobRoleRepository = db.getCustomRepository(JobRoleRepository);
  const levelRepository = db.getCustomRepository(LevelRepository);
  await SeedRegionWage(db, regionRepository, jobRoleRepository, levelRepository);
  await SeedAvailableWorkers(db);
  await SeedJobRoleTemplate(db);
  await SeedWorkTypes(db);
  await seedTransformations(db);
}

async function SeedWorkTypes(db: Connection) {
  const start = Date.now();
  log('Seeding WorkTypes');
  await Promise.all(
    workTypeData.map(async (data) => {
      let workType = await db.getCustomRepository(WorkTypeRepository).findOne(data.id, data.tenantId);
      if (workType === undefined) {
        workType = new WorkType();
      }
      Object.assign(workType, data);
      await db.getCustomRepository(WorkTypeRepository).save(workType);
    }),
  );
  const end = Date.now();
  log(`count: ${workTypeData.length}`, 3);
  log(`time:  ${parseProcessingTime(end - start)}`, 3);
}

async function SeedRegionWage(
  db: Connection,
  regionRepository: RegionRepository,
  jobRoleRepository: JobRoleRepository,
  levelRepository: LevelRepository,
) {
  const start = Date.now();
  log('Seeding RegionWage');
  const regionWageRepository = db.getCustomRepository(RegionWageRepository);
  const regionWageData = await generateRegionWageData(regionRepository, jobRoleRepository, levelRepository);
  await Promise.all(
    regionWageData.map(async (data) => {
      let regionWage = await regionWageRepository.findWageForRegionJobRoleAndLevel(
        data.tenantId,
        data.regionId,
        data.jobRoleId,
        data.experienceLevelId,
      );
      if (!regionWage) {
        regionWage = new RegionWage();
      }
      Object.assign(regionWage, data);
      await regionWageRepository.save(regionWage);
    }),
  );
  const end = Date.now();
  log(`count: ${regionWageData.length}`, 3);
  log(`time:  ${parseProcessingTime(end - start)}`, 3);
}

async function SeedRegionPostalCode() {
  const start = Date.now();
  log('Seeding RegionPostalCode');
  //clear old PostalCodes
  await getConnection().query(`truncate "RegionPostalCode"`);

  // RegionPostalCode seeding is disabled until we don't support region detection by location postal code

  //const regionPostalCodeRepository = db.getCustomRepository(RegionPostalCodeRepository);
  //const regionPostalCodeData = generateRegionPostalCodeData(regionData);
  //await Promise.all(
  //  regionPostalCodeData.map(async (data) => {
  //    let regionPostalCode = await regionPostalCodeRepository.findOne(data.regionId, data.zip);
  //    if (!regionPostalCode) {
  //      regionPostalCode = new RegionPostalCode();
  //      Object.assign(regionPostalCode, data);
  //      await regionPostalCodeRepository.save(regionPostalCode);
  //    }
  //  }),
  //);
  const end = Date.now();
  log(`count: ${0}`, 3);
  log(`time:  ${parseProcessingTime(end - start)}`, 3);
}

async function SeedRegion(db: Connection) {
  const start = Date.now();
  log('Seeding Region');
  const regionRepository = db.getCustomRepository(RegionRepository);
  const regionData = generateRegionData();
  await Promise.all(
    regionData.map(async (data) => {
      let region = await regionRepository.findOne(data.id);
      if (!region) {
        region = new Region();
      }

      Object.assign(region, data);
      await regionRepository.save(region);
    }),
  );
  const end = Date.now();
  log(`count: ${regionData.length}`, 3);
  log(`time:  ${parseProcessingTime(end - start)}`, 3);
}

async function SeedJobRole(db: Connection) {
  const start = Date.now();
  const jobRoleSeed = new JobRoleSeed();
  await jobRoleSeed.populateData(jobRoleData);
  await jobRoleSeed.execute(db);
  const end = Date.now();
  log(`count: ${jobRoleData.length}`, 3);
  log(`time:  ${parseProcessingTime(end - start)}`, 3);
}

async function SeedAvailableWorkers(db: Connection) {
  log('Seeding AvailableWorkers');
  const availableWorkersRepository = db.getCustomRepository(AvailableWorkersRepository);
  await Promise.all(
    availableWorkersData.map(async (data) => {
      const {jobRoleId, tenantId} = data;
      let availableWorkers = await availableWorkersRepository.findOne(tenantId, jobRoleId);
      if (availableWorkers === undefined) {
        availableWorkers = new AvailableWorkers(data);
      }
      return availableWorkersRepository.save(availableWorkers);
    }),
  );
}

async function SeedJobRoleTemplate(db: Connection) {
  log('Seeding JobRoleTemplate');
  const jobRoleTemplateRepository = db.getCustomRepository(JobRoleTemplateRepository);
  await Promise.all(
    jobRoleTemplateData.map(async (data) => {
      let jobRoleTemplate = await jobRoleTemplateRepository.findOne(data.tenantId, data.id);
      if (jobRoleTemplate === undefined) {
        jobRoleTemplate = new JobRoleTemplate(data);
      }

      Object.assign(jobRoleTemplate, data);
      return jobRoleTemplateRepository.save(jobRoleTemplate);
    }),
  );
}

async function SeedPermissions(db: Connection) {
  log('Seeding Permissions');
  const permissionRepository = db.getCustomRepository(PermissionRepository);
  await Promise.all(
    permissionData.map(async (data) => {
      let permission = await permissionRepository.findOneByName(data.tenantId, data.name);
      if (permission === undefined) {
        permission = new Permission();
      }

      Object.assign(permission, data);
      return await permissionRepository.save(permission);
    }),
  );
}

async function SeedFeatureConfiguration(db: Connection) {
  log('Seeding FeatureConfiguration');
  const featureConfigurationRepository: FeatureConfigurationRepository = db.getCustomRepository(
    FeatureConfigurationRepository,
  );
  await Promise.all(
    featureConfigurationData.map(async (data) => {
      let fc = await featureConfigurationRepository.findOneForChannelAndFeature(
        data.tenantId,
        data.channel,
        data.feature,
      );

      if (fc === undefined) {
        fc = new FeatureConfiguration();
      }
      Object.assign(fc, data);
      return await featureConfigurationRepository.save(fc);
    }),
  );
}

async function SeedCertification(db: Connection) {
  log('Seeding Certification');
  await Promise.all(
    certificationData.map(async (data) => {
      let certification = await db
        .getCustomRepository(CertificationRepository)
        .findOneByCertificationId(data.id, data.tenantId);
      if (certification === undefined) {
        certification = new Certification(data);
      }
      Object.assign(certification, data);
      return db.getCustomRepository(CertificationRepository).save(certification);
    }),
  );
}

async function SeedSector(db: Connection) {
  log('Seeding Sector');
  await Promise.all(
    sectorData.map(async (data) => {
      let sector = await db.getCustomRepository(SectorRepository).findOne(data.id, data.tenantId);
      if (sector === undefined) {
        sector = new Sector(data);
      }
      if (!sector.keyName) {
        sector.keyName = generateCamelCaseFromText(sector.name);
      }
      Object.assign(sector, data);
      return db.getCustomRepository(SectorRepository).save(sector);
    }),
  );
}

async function SeedEmploymentType(db: Connection) {
  log('Seeding EmploymentType');
  await Promise.all(
    employmentTypeData.map(async (data) => {
      let employmentType = await db
        .getCustomRepository(EmploymentTypeRepository)
        .findOneByEmploymentTypeId(data.id, data.tenantId);
      if (employmentType === undefined) {
        employmentType = new EmploymentType(data);
      }
      Object.assign(employmentType, data);
      return db.getCustomRepository(EmploymentTypeRepository).save(employmentType);
    }),
  );
}

async function SeedRate(db: Connection) {
  log('Seeding Rate');
  await Promise.all(
    rateData.map(async (data) => {
      let rate = await db.getCustomRepository(RateRepository).findOne(data.id, data.tenantId);
      if (rate === undefined) {
        rate = new Rate(data);
      }
      if (!rate.keyName) {
        rate.keyName = generateCamelCaseFromText(rate.name);
      }
      Object.assign(rate, data);
      return db.getCustomRepository(RateRepository).save(rate);
    }),
  );
}

async function SeedShift(db: Connection) {
  log('Seeding Shift');
  await Promise.all(
    shiftData.map(async (data) => {
      let shift = await db.getCustomRepository(ShiftRepository).findOne(data.id, data.tenantId);
      if (shift === undefined) {
        shift = new Shift(data);
      }
      if (!shift.keyName) {
        shift.keyName = generateCamelCaseFromText(shift.name);
      }
      Object.assign(shift, data);
      return db.getCustomRepository(ShiftRepository).save(shift);
    }),
  );
}

async function SeedServiceType(db: Connection) {
  log('Seeding Service Type');
  await Promise.all(
    serviceTypeData.map(async (data) => {
      let serviceType = await db.getCustomRepository(ServiceTypeRepository).findOne(data.id, data.tenantId);
      if (serviceType === undefined) {
        serviceType = new ServiceType(data);
      }
      if (!serviceType.keyName) {
        serviceType.keyName = generateCamelCaseFromText(serviceType.name);
      }
      Object.assign(serviceType, data);
      return db.getCustomRepository(ServiceTypeRepository).save(serviceType);
    }),
  );
}

async function SeedCloseReasons(db: Connection) {
  log('Seeding Close Reasons');
  await Promise.all(
    closeReasonData.map(async (data) => {
      let closeReason = await db.getCustomRepository(CloseReasonRepository).findOne(data.tenantId, data.id);
      if (closeReason === undefined) {
        closeReason = new CloseReason();
      }
      Object.assign(closeReason, data);
      return await db.getCustomRepository(CloseReasonRepository).save(closeReason);
    }),
  );
}

async function SeedConsents(db: Connection) {
  log('Seeding Consents');
  await Promise.all(
    generateConsentSeedData().map(async (data) => {
      let consent = await db.getCustomRepository(ConsentRepository).findOne(data.tenantId, data.id);
      if (consent === undefined) {
        consent = new Consent();
      }
      Object.assign(consent, data);
      return db.getCustomRepository(ConsentRepository).save(consent);
    }),
  );
}

async function SeedTypes(db: Connection) {
  log('Seeding Types');
  for (const data of typeData) {
    let type = await db.getCustomRepository(TypeRepository).findOneByName(data.tenantId, data.name, data.entityName);
    if (type === undefined) {
      type = new Type(data);
    }
    Object.assign(type, data);
    await db.getCustomRepository(TypeRepository).save(type);
  }
}

async function SeedStatuses(db: Connection) {
  log('Seeding Statuses');
  const statusRepository = db.getCustomRepository(StatusRepository);
  await Promise.all(
    statusData.map(async (data) => {
      const {tenantId, name, entityName} = data;
      let status = await db.getCustomRepository(StatusRepository).findOne(tenantId, name, entityName);
      if (status === undefined) {
        status = new Status(data);
      }
      return statusRepository.save(status);
    }),
  );
}

async function SeedTenants(db: Connection, envPrefix: string, isDebug: boolean) {
  log('Seeding Tenants');
  await Promise.all(
    tenantData.map(async (data) => {
      let tenant = await db.getCustomRepository(TenantRepository).findOne(data.id);
      if (tenant === undefined) {
        tenant = new Tenant();
      }
      const invitationUrl = InvitationUrl[envPrefix].replace('$tenantId', data.id);
      data.domain = invitationUrl;
      Object.assign(tenant, data);
      logSuccess(`+ Seed Tenant #${tenant.id} ${tenant.name} [${tenant.brand}]`, 3, isDebug);
      return db.getCustomRepository(TenantRepository).save(tenant);
    }),
  );
}
