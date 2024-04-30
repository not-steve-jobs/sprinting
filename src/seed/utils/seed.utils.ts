import * as dateFns from 'date-fns';
import {UUIDSection} from './uuidSection.enum';
import {UtilsHelper} from 'src/helpers/utils.helper';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as stream from 'stream';
import {padStart} from 'lodash';
import camelcase from 'camelcase';
import slugify from 'slugify';
import {LocationStatusEnum} from 'src/modules/location/location.enum';
import {PlainObject} from '../../modules/common/common.dto';
import {SeedFeatures} from '../tenantSpecific/data/seedFeatures.data';
import {statusData} from '../tenantSpecific/data/status.data';
import {Location} from 'src/modules/location/location.entity';

import {once} from 'events';

const finished = util.promisify(stream.finished);

export const intGuid = function (id: number, section: number = UUIDSection.default) {
  if (id.toString().length > 12) {
    throw new Error(`NotImplemented id: ${id}`);
  }
  if (section.toString().length > 4) {
    throw new Error(`NotImplemented id: ${section}`);
  }

  return `00000000-0000-${padStart(section.toString(), 4, '0')}-0000-${padStart(id.toString(), 12, '0')}`; // uuid format: 00000000-0000-0000-0000-000000000000
};

export const getRandomEntityStatus = (tenantId: number, entityName: string) => {
  const availableStatuses = statusData.filter(
    ({entityName: statusEntityName, tenantId: statusTenantId}) =>
      statusEntityName === entityName && statusTenantId === tenantId,
  );
  return availableStatuses[Math.floor(UtilsHelper.randomNumber() * availableStatuses.length)];
};

export const getRandomIntIndex = (max: number, min: number = 0) => {
  return Math.floor(UtilsHelper.randomNumber() * (max - min) + min);
};

export const getLocationsByClient = (locations: Location[] = [], clientId?: string): Location[] => {
  const filteredLocations = locations.filter((l) => l.status !== LocationStatusEnum.New);
  return clientId ? filteredLocations.filter((l) => l.clientId === clientId) : filteredLocations;
};

/**
 * Simply drop a line in the log using a specific format
 *
 * @param {string} msg - The content of the message which should be logged in the console
 * @param {number} indent - Indent the message at certain level
 * @param {boolean} debug - Control the output of the logger
 * @param {'error' | 'success' | 'info' | 'log'} level - Highlight the color of the message according to its type
 */
export const log = (
  msg: string,
  indent: number = 2,
  debug: boolean = true,
  level?: 'error' | 'success' | 'info' | 'log',
): void => {
  let color = '33';
  if (level) {
    switch (level) {
      case 'info':
        color = '36';
        break;
      case 'success':
        color = '32';
        break;
      case 'error':
        color = '31';
        break;
      case 'log':
      default:
        color = '33';
        break;
    }
  }

  if (debug) {
    console.log(`\x1b[${color}m%s\x1b[0m`, `${Array(indent).join('   ')}${msg}`);
  }
};

/**
 * Alias to drop a success message in the console, highlighted in green color
 *
 * @param {string} msg - The content of the message which should be logged in the console
 * @param {number} indent - Indent the message at certain level
 * @param {boolean} debug - Control the output of the logger
 */
export const logSuccess = (msg: string, indent: number = 2, debug: boolean = true): void => {
  log(msg, indent, debug, 'success');
};

/**
 * Alias to drop an info message in the console, highlighted in cyan color
 *
 * @param {string} msg - The content of the message which should be logged in the console
 * @param {number} indent - Indent the message at certain level
 * @param {boolean} debug - Control the output of the logger
 */
export const logInfo = (msg: string, indent: number = 2, debug: boolean = true): void => {
  log(msg, indent, debug, 'info');
};

/**
 * Alias to drop an info message in the console, highlighted in red color
 *
 * @param {string} msg - The content of the message which should be logged in the console
 * @param {number} indent - Indent the message at certain level
 * @param {boolean} debug - Control the output of the logger
 */
export const logError = (msg: string, indent: number = 2, debug: boolean = true): void => {
  log(msg, indent, debug, 'error');
};

/**
 * Check the command line for a --debug switch
 * @returns boolean
 */
export const isDebugMode = (): boolean => {
  const isDebugArgv = process.argv.filter((argument) => argument === '--debug');
  return isDebugArgv.length > 0;
};

/**
 * Check if some seed should be executed or not
 * @returns boolean
 */
export const shouldSeedTenantRelatedData = (tenantData: PlainObject, feature: SeedFeatures): boolean => {
  // seed data by default if we don't have config defined (tenantData.seedFlags)
  if (!tenantData || !tenantData?.seedFlags) {
    return true;
  }
  return !!tenantData?.seedFlags?.[feature];
};

/**
 * Generates a string in Camel case format from a text.
 *
 * @param {string} text - The base text.
 * @returns {string} - The generated string in Camel case format.
 */
export const generateCamelCaseFromText = (text: string): string => {
  // Adds an empty space before every special symbol (with few exceptions)
  const formattedText = text.replace(/([^a-zA-Z\d\s:'])/gm, ' $1');
  const slugifyOptions = {
    lower: true,
    strict: true,
    remove: /[`!@#^*<>()_+\-=\[\]{};':"\\|,.\/?~]/gm,
  };

  const slugifiedText = slugify(formattedText, slugifyOptions);
  const camelCasedString = camelcase(slugifiedText);

  return camelCasedString;
};

export const generateRawSqlSync = (name: string, sqlString: string, sequence?: number) => {
  const sequenceStr = sequence !== undefined ? `-${sequence}` : '';
  fs.writeFileSync(path.resolve(__dirname, `../raw/${name}${sequenceStr}.sql`), sqlString);
};

// generally slower than the synchronous version above, but can be meaningful for low-mem env
export const generateRawSql = async (name: string, sqlString: string, sequence?: number) => {
  const sequenceStr = sequence !== undefined ? `-${sequence}` : '';
  const aWrite = async () => {
    const fPath = path.resolve(__dirname, `../raw/${name}${sequenceStr}.sql`);
    const writable = fs.createWriteStream(fPath, {encoding: 'utf8'});
    const rows = sqlString.split(`\n`);
    for await (const chunk of rows) {
      if (!writable.write(`${chunk}\n`)) {
        await once(writable, 'drain');
      }
    }
    writable.end();
    await finished(writable);
  };
  return await aWrite();
};

export const executeRawInsert = async (
  db: any,
  seed: any,
  maxRowsPerQuery: number = 1000,
  dbg: boolean = false,
): Promise<number> => {
  const {name} = seed;
  const rawDir = path.resolve(__dirname, '../raw/');
  if (fs.existsSync(`${rawDir}/${name}-0.sql`)) {
    const entity = db.entityMetadatas.find((em: any) => em.tableName === seed.objClass.name);
    if (!entity) {
      throw new Error(`Entity "${seed.objClass.name}" not found`);
    }
    const pks = entity.primaryColumns.map((pk: any) => pk.propertyName);
    let bigQ: string[] = [];
    let i: number = 0;
    let total: number = 0;
    let min = 1000,
      max = 0;
    while (fs.existsSync(`${rawDir}/${name}-${i}.sql`)) {
      let rows: number = 0;
      const st = new Date();
      const sql = fs.readFileSync(`${rawDir}/${name}-${i}.sql`).toString().replace(/\t/gm, '');
      const recs = sql.split(/\n/).filter((s: string) => s !== '' && s.length > 2);
      const cmd = recs.shift();
      if (!cmd || !cmd.includes('(')) {
        throw new Error(`Please provide${cmd ? ' field list in your' : ''} INSERT statement`);
      }
      const fields =
        cmd
          .split('(')
          .pop()
          ?.split(')')
          .shift()
          ?.split(',')
          .map((fld) => fld.trim()) || [];
      if (fields.length < 1) {
        throw new Error('Problem parsing field list in INSERT statement');
      }
      const onConflict = `on conflict ("${pks.join('", "')}") do update set ${fields
        .filter((f) => !pks.includes(f))
        .map((f) => `${f} = EXCLUDED.${f}`)
        .join(', ')}`;
      bigQ = [];
      for (const [index, rec] of recs.entries()) {
        bigQ.push(rec.replace(/[,;]$/g, ''));
        if (bigQ.length === maxRowsPerQuery || (index === recs.length - 1 && bigQ.length > 0)) {
          try {
            await db.query(`${cmd} ${bigQ.join(', ')} ${onConflict}`);
          } catch (err) {
            throw new Error(err);
          }
          rows += bigQ.length;
          bigQ = [];
        }
      }
      const ct = dateFns.differenceInSeconds(new Date(), st);
      min = ct < min ? ct : min;
      max = ct > max ? ct : max;
      if (dbg) {
        console.log(`Sequence ${i} finished in ${ct}s (min: ${min}s, max: ${max}s), rows processed: ${rows}`);
      }
      total += rows;
      i++;
    }
    if (dbg) {
      console.log(`Total rows processed for "${name}": ${total}`);
    }
    return total;
  } else {
    throw new Error(`No generated sql script found for "${name}"`);
  }
};

/**
 * Parse milliseconds to a human readable format
 *
 * @param {number} [duration=0] - number of milliseconds
 * @return {string} - formatted string ('00:00:00.000' -> 'hh:mm:ss.milliseconds')
 */
export const parseProcessingTime = (duration: number = 0): string => {
  if (duration === 0) {
    return '00:00:00.000';
  }

  const milliseconds = Math.floor(duration % 1000);
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${padStart(hours.toString(), 2, '0')}:${padStart(minutes.toString(), 2, '0')}:${padStart(
    seconds.toString(),
    2,
    '0',
  )}.${padStart(milliseconds.toString(), 3, '0')}`;
};

export const generateClientName = (clientName: string, code: string): string => `${clientName} - ${code}`;
