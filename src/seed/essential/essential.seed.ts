import {generateCamelCaseFromText, isDebugMode, log, logSuccess} from '../utils/seed.utils';
import {Connection} from 'typeorm';
import {roleData} from './data/role.data';
import {Role} from '../../modules/role/role.entity';
import {currencyData} from './data/currency.data';
import {Currency} from '../../modules/currency/currency.entity';
import {RoleRepository} from '../../modules/role/role.repository';
import {CurrencyRepository} from '../../modules/currency/currency.repository';
import {countryData} from './data/country.data';
import {CountryRepository} from '../../modules/country/country.repository';
import {Country} from '../../modules/country/country.entity';
import {LevelRepository} from '../../modules/level/level.repository';
import {levelData} from './data/level.data';
import {Level} from '../../modules/level/level.entity';
import {LanguageRepository} from '../../modules/language/language.repository';
import {languageData} from './data/language.data';
import {Language} from '../../modules/language/language.entity';
import {Department} from '../../modules/department/department.entity';
import {DepartmentRepository} from '../../modules/department/department.repository';
import {DepartmentFunctionRepository} from '../../modules/departmentFunction/departmentFunction.repository';
import {departmentData} from './data/department.data';
import {departmentFunctionData} from './data/departmentFunction.data';
import {DepartmentFunction} from '../../modules/departmentFunction/departmentFunction.entity';
import {disableReasonData} from './data/disableReason.data';
import {DisableReasonRepository} from '../../modules/disableReason/disableReason.repository';
import {DisableReason} from '../../modules/disableReason/disableReason.entity';
import {caseCategoryData} from './data/caseCategory.data';
import {CaseCategoryRepository} from '../../modules/caseCategory/caseCategory.repository';
import {CaseCategory} from '../../modules/caseCategory/caseCategory.entity';

/**
 * Seed base data which is required to make the system operational

 * @param {Connection} db - The active connection used for the communication with the DB
 * @param {string} envPrefix - Information for the env on which we currently perform the seeding
 * @returns - A simple promise to ensure that all of the action have been dispatched
 */
export async function essentialSeed(db: Connection) {
  console.log(`Seeding Essential Data`);
  const isDebug = isDebugMode();
  await SeedCountries(db);
  await SeedLanguages(db);
  await SeedRoles(db, isDebug);
  await SeedDisableReasons(db);
  await SeedCurrency(db);
  await SeedLevel(db);
  await SeedDepartment(db);
  await SeedDepartmentFunction(db);
  await SeedCaseCategories(db);
}

async function SeedCaseCategories(db: Connection) {
  log('Seeding Case Categories');
  await Promise.all(
    caseCategoryData.map(async (data) => {
      let caseCategory = await db.getCustomRepository(CaseCategoryRepository).findOne(data.id);
      if (caseCategory === undefined) {
        caseCategory = new CaseCategory();
      }
      Object.assign(caseCategory, data);
      await db.getCustomRepository(CaseCategoryRepository).save(caseCategory);
    }),
  );
}

async function SeedDepartmentFunction(db: Connection) {
  log('Seeding DepartmentFunction');
  await Promise.all(
    departmentFunctionData.map(async (data) => {
      let departmentFunction = await db.getCustomRepository(DepartmentFunctionRepository).findOneById(data.id);
      if (departmentFunction === undefined) {
        departmentFunction = new DepartmentFunction(data);
      }
      if (!departmentFunction.keyName) {
        departmentFunction.keyName = generateCamelCaseFromText(departmentFunction.name);
      }
      Object.assign(departmentFunction, data);
      await db.getCustomRepository(DepartmentFunctionRepository).save(departmentFunction);
    }),
  );
}

async function SeedDepartment(db: Connection) {
  log('Seeding Department');
  await Promise.all(
    departmentData.map(async (data) => {
      let department = await db.getCustomRepository(DepartmentRepository).findOneById(data.id);
      if (department === undefined) {
        department = new Department(data);
      }
      if (!department.keyName) {
        department.keyName = generateCamelCaseFromText(department.name);
      }
      Object.assign(department, data);
      await db.getCustomRepository(DepartmentRepository).save(department);
    }),
  );
}

async function SeedLevel(db: Connection) {
  log('Seeding Level');
  const levelRepository = db.getCustomRepository(LevelRepository);
  await Promise.all(
    levelData.map(async (data) => {
      let level = await levelRepository.findOne(data.id, data.entityName);
      if (level === undefined) {
        level = new Level(data);
      }
      if (!level.keyName) {
        level.keyName = generateCamelCaseFromText(level.name);
      }
      Object.assign(level, data);
      return levelRepository.save(level);
    }),
  );
  // return levelRepository;
}

async function SeedCurrency(db: Connection) {
  log('Seeding Currency');
  await Promise.all(
    currencyData.map(async (data) => {
      let currency = await db.getCustomRepository(CurrencyRepository).findOne(data.id);
      if (currency === undefined) {
        currency = new Currency(data);
      }
      Object.assign(currency, data);
      return db.getCustomRepository(CurrencyRepository).save(currency);
    }),
  );
}

async function SeedDisableReasons(db: Connection) {
  log('Seeding Disable Reasons');
  await Promise.all(
    disableReasonData.map(async (data) => {
      let disableReason = await db.getCustomRepository(DisableReasonRepository).findOne(data.id);
      if (disableReason === undefined) {
        disableReason = new DisableReason();
      }
      Object.assign(disableReason, data);
      return await db.getCustomRepository(DisableReasonRepository).save(disableReason);
    }),
  );
}

async function SeedRoles(db: Connection, isDebug: boolean) {
  log('Seeding Role');
  for (const data of roleData) {
    let role = await db.getCustomRepository(RoleRepository).findOneByName(data.name);
    if (role === undefined) {
      role = new Role(data);
    }
    if (!role.keyName) {
      role.keyName = generateCamelCaseFromText(role.name);
    }
    Object.assign(role, data);
    logSuccess(`+ Seed Role #${role.id} ${role.name}`, 3, isDebug);
    await db.getCustomRepository(RoleRepository).save(role);
  }
}

async function SeedCountries(db: Connection) {
  log('Seeding Countries');
  await Promise.all(
    countryData.map(async (data) => {
      let country = await db.getCustomRepository(CountryRepository).findOne(data.id);
      if (country === undefined) {
        country = new Country();
      }
      Object.assign(country, data);
      return db.getCustomRepository(CountryRepository).save(country);
    }),
  );
}

async function SeedLanguages(db: Connection) {
  log('Seeding Language');
  await Promise.all(
    languageData.map(async (data) => {
      let language = await db.getCustomRepository(LanguageRepository).findOne(data.id);
      if (language === undefined) {
        language = new Language();
      }
      Object.assign(language, data);
      return db.getCustomRepository(LanguageRepository).save(language);
    }),
  );
}
