import crypto from 'crypto';
import {Injectable} from '@nestjs/common';
import util from 'util';
import {sampleSize as lodashSampleSize} from 'lodash';
import {Readable} from 'typeorm/platform/PlatformTools';
import {serializeError} from 'serialize-error';
import {Stream} from 'stream';
import {v4 as uuid} from 'uuid';
import {Between, In, IsNull, LessThan, Like, MoreThan, Not} from 'typeorm';
import * as dateFns from 'date-fns';
import {PlainObject} from 'src/modules/common/common.dto';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {GeocodeResponse} from '@googlemaps/google-maps-services-js';

@Injectable()
export class UtilsHelper {
  public isString(x: any): x is string {
    return typeof x === 'string';
  }

  /** Email regex */
  public get emailRegExp(): RegExp {
    return /(?=^.{3,320}$)^([a-zA-Z0-9_.+-]{1,69}@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)$/g;
  }

  /** Used for deepMerge **/
  private isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Create first masked part of an email
   */
  private replaceFirstPart(firstPartOfAnEmail: string): string {
    if (!firstPartOfAnEmail) {
      return '';
    }
    if (firstPartOfAnEmail.length === 1) {
      return '*';
    }
    let separator = '+';
    if (firstPartOfAnEmail.indexOf(separator) === -1) {
      separator = '%2B';
    }
    const parts = firstPartOfAnEmail.split(separator);
    // let retVal = "";
    let i = parts[0].startsWith('*') ? 2 : 1;
    let retVal = parts[0].startsWith('*') ? (parts[0][0] ? parts[0][0] : parts[0][1] ? parts[0][1] : '') : parts[0][0];
    // retVal += parts[0][0];
    if (parts.length === 1) {
      for (; i < parts[0].length; i++) {
        retVal += '*';
      }
      return retVal;
    } else {
      for (let j = 1; j < parts[0].length; j++) {
        retVal += '*';
      }
      return `${retVal}+${parts[1]}`;
    }
  }

  /**
   * Create second masked part of an email
   */
  private replaceSecondPart(secondPartOfAnEmail: string): string {
    if (!secondPartOfAnEmail) {
      return '';
    }
    const parts = secondPartOfAnEmail.split('.');
    let retVal = '';
    retVal += parts[0][0];
    for (let i = 1; i < parts[0].length; i++) {
      retVal += '*';
    }
    return `${retVal}.${parts[1]}`;
  }

  /**
   * Creates a simple string-based representation of an object suited for debugging and logging.
   */
  public dump(obj: object): string {
    return util.inspect(obj, {breakLength: 180});
  }

  public generateTrackingId(prefix: string, length: number = 5): string {
    return `${prefix}-${this.randomString(length, '23456789ABCDEFGHJKLMNPQRSTUVWXYZ')}`;
  }

  /**
   * Generates random string
   */
  public randomString(
    length = 10,
    possible = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ): string {
    const s = new Array(length);
    for (let i = 0; i < length; ++i) {
      s[i] = possible.charAt(Math.floor(UtilsHelper.randomNumber() * possible.length));
    }
    return s.join('');
  }

  /**
   * Returns a value after specified time
   */
  public delay(time: number, value: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), time);
    });
  }

  /**
   * Returns a random UUID v4
   */
  public static dbUuid(): string {
    return uuid();
  }

  /**
   * Deeply merges target and source
   * @param target
   * @param source
   */
  public deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (!this.isObject(source[key])) {
          return Object.assign(output, {[key]: source[key]});
        }

        if (!(key in target)) {
          Object.assign(output, {[key]: source[key]});
        } else {
          output[key] = this.deepMerge(target[key], source[key]);
        }
      });
    }
    return output;
  }

  /**
   * Create a masked email for logging to Kibana
   */
  public getMaskedEmail(email: string): string {
    let separator = '@';
    if (email.indexOf(separator) === -1) {
      separator = '%40';
    }
    const allEmailParts = email.split(separator);
    return this.replaceFirstPart(allEmailParts[0]) + separator + this.replaceSecondPart(allEmailParts[1]);
  }

  /**
   * Creates and returns new RegExp using email for pattern
   */
  public createRegExp(email: string): RegExp {
    return new RegExp(email.replace(/\+/g, '\\+').replace('.', '\\.').replace(/\*/g, '.*'));
  }

  public maskEmails(text: string): string {
    return text.replace(this.emailRegExp, (email) => this.getMaskedEmail(email));
  }

  public deepMaskEmails(source: string, urlEncoded: boolean): string;
  public deepMaskEmails(source: object, urlEncoded: boolean): object;
  public deepMaskEmails(source: string | object, urlEncoded: boolean = false): string | object {
    if (source === null) {
      return null;
    }

    if (typeof source === 'number') {
      return source;
    }

    if (typeof source === 'string') {
      return this.maskEmails(source);
    }

    const clone = source instanceof Error ? serializeError(source) : Object.assign({}, source);
    for (const property in clone) {
      if (!clone.hasOwnProperty(property)) {
        continue;
      }

      if (typeof clone[property] === 'object') {
        if (Array.isArray(clone[property])) {
          clone[property] = clone[property].map((el) => this.deepMaskEmails(el, urlEncoded));
        } else {
          clone[property] = this.deepMaskEmails(clone[property], urlEncoded);
        }
      } else if (typeof clone[property] === 'string') {
        clone[property] = this.maskEmails(clone[property]);
      }
    }
    return clone;
  }

  public censorWord(str: string) {
    if (str.length <= 2) {
      return str;
    }
    return `${str[0]}${'*'.repeat(str.length - 2)}${str.slice(-1)}`;
  }

  public censorEmail(email: string) {
    if (!email || email.indexOf('@') === -1 || email.indexOf('@') === email.length - 1) {
      return;
    }
    const arr = email.split('@');
    return `${this.censorWord(arr[0])}@${this.censorWord(arr[1])}`;
  }

  public static randomNumber = () => crypto.randomBytes(4).readUInt32LE() / 0x100000000;

  public static random = (min: number, max: number) => Math.floor(UtilsHelper.randomNumber() * (max - min + 1) + min);

  public static getRandomItem = (arr: any[]) => {
    const i = UtilsHelper.random(0, arr.length - 1);
    return arr[i];
  };

  public static randomEnums(en, elementsCount: number): (string | number)[] {
    return lodashSampleSize(Object.values(en), elementsCount);
  }

  public static async streamToBase64(stream: Stream): Promise<string> {
    const buffers = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (buffer) => buffers.push(buffer));
      stream.on('end', () => resolve(Buffer.concat(buffers).toString('base64')));
      stream.on('error', () => reject());
    });
  }

  public static async base64ToStream(base64: string) {
    const stream = new Readable();
    stream.push(Buffer.from(base64, 'base64'));
    stream.push(null);
    return stream;
  }

  public generateSalt(length = 16) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  public generateSHAcode(email: string): string {
    const hash = crypto.createHmac('sha256', this.generateSalt());
    hash.update(email);
    return hash.digest('hex');
  }

  traceId = (prefix: string, length = 6, possible = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'): string => {
    const s = new Array(length);
    for (let i = 0; i < length; ++i) {
      s[i] = possible.charAt(Math.floor(UtilsHelper.randomNumber() * possible.length));
    }
    return `${prefix}-${s.join('')}`;
  };

  public static generateFilters = ({findIn, findBetween, findLike}) => {
    const filters = {};
    findBetween &&
      findBetween.forEach((b) => {
        if (b.from && b.to) {
          filters[b.key] = Between(b.from, b.to);
        } else if (b.from) {
          filters[b.key] = MoreThan(b.from);
        } else if (b.to) {
          filters[b.key] = LessThan(b.to);
        }
      });

    findLike &&
      findLike.forEach((l) => {
        filters[l.key] = Like(`%${l.value}%`);
      });

    findIn &&
      findIn.forEach((i) => {
        if (i.key == 'overdue') {
          filters['duePaymentDate'] = LessThan(dateFns.format(new Date(), 'yyyy-MM-dd'));
        } else if (i.key == 'creditNotes') {
          filters['creditNotes'] = Not(IsNull());
        } else {
          filters[i.key] = In(i.value);
        }
      });

    return filters;
  };

  // TODO This should be fixed
  public static getTableFromSortKey = (columnName: string, target: string = '') => {
    // TODO This isn't completed
    switch (columnName) {
      case 'nameAndImage':
      case 'title':
      case 'createdBy':
        return 'UserProfile.';
      case 'caseCategory':
        return 'CaseCategory.';
      case 'mainLocation':
      case 'location':
        // if (target === 'case') return 'Case.';
        return 'Location.';
      case 'department':
        return '';
      case 'function':
        return 'DepartmentFunction.';
      case 'status':
        return 'Status.';
      case 'type':
        return 'Type.';
      case 'userType':
      case 'role':
        return 'Role.';
      case 'number':
        if (target === 'contract') {
          return 'Contract.';
        } else if (target === 'invoice') {
          return 'Invoice.';
        }
      case 'submissionDate':
      case 'createBy':
      case 'startDate':
      case 'endDate':
      case 'noOfPositions':
      case 'name':
        if (target === 'contract') {
          return 'Contract.';
        } else if (target === 'invoice') {
          return 'Invoice.';
        }
        return 'JobOrder.';
      case 'dateStart':
      case 'dateEnd':
      case 'signatureDate':
      case 'signedBy':
      case 'issueDate':
      case 'associateName':
      case 'type':
      case 'service':
        if (target === 'contract') {
          return 'Contract.';
        } else if (target === 'invoice') {
          return 'Invoice.';
        }
        return '';
      case 'totalAmount':
      case 'duePaymentDate':
      case 'periodStart':
      case 'periodEnd':
      case 'overdue':
      case 'creditNotes':
      case 'amountBeforeTax':
      case 'currency':
        if (target === 'invoice') {
          return 'Invoice.';
        }
        return '';
      case 'serviceType':
        if (target === 'contract') {
          return 'Contract.';
        }
        return 'ServiceType.';
      case 'updatedAt':
      case 'createdAt':
        if (target === 'jobOrderAssociate') {
          return 'JobOrderAssociate.';
        }
        return 'JobOrder.';
      case 'isImportant':
        return 'CaseFollower.';
      default:
        return '';
    }
  };

  public static getColumnNameFromSortKey = (columnName: string, target: string = '') => {
    // TODO This isn't completed
    switch (columnName) {
      case 'department':
        return 'department_name_coalesced';
      case 'nameAndImage':
      case 'createdBy':
        return 'firstName';
      case 'caseCategory':
        return 'name';
      case 'function':
      case 'status':
      case 'type':
      case 'userType':
      case 'role':
      case 'createBy':
        return 'name';
      case 'serviceType':
        if (target === 'contract') {
          return 'serviceType';
        }
        return 'name';
      case 'mainLocation':
      case 'location':
        // if (target === 'case') return 'location';
        return 'locationName';
      case 'submissionDate':
        return 'submissionDate';
      case 'number':
        return 'id';
      case 'title':
        return 'title';
      case 'startDate':
        return 'dateStart';
      case 'endDate':
        return 'dateEnd';
      case 'overdue':
        return 'duePaymentDate';
      case 'noOfPositions':
        return 'numberOfOpenings';
      case 'attachments':
      case 'worksite':
      case 'permissions':
      case 'legalEntity':
        return '';
      case 'isImportant':
        return ['isUserFollower', 'isCaseRead'];
      default:
        return columnName.replace(/[^a-z]/gi, '');
    }
  };

  public static getTableNameFromFilterKey = (filterKey: string, target: string = '') => {
    // TODO This isn't completed and should definitely be refactored
    switch (filterKey) {
      case 'name':
      case 'signedBy':
      case 'associateName':
        if (target === 'contract') {
          return 'Contract';
        } else if (target === 'invoice') {
          return 'Invoice';
        }
        return 'UserProfile';
      case 'category':
        return 'CaseCategory';
      case 'type':
        return 'Type';
      case 'location':
        return 'Location';
      case 'department':
        return 'Department';
      case 'function':
        return 'DepartmentFunction';
      case 'permission':
        return 'Permission';
      case 'status':
      case 'userStatus':
        return 'Status';
      case 'userType':
      case 'role':
        return 'Role';
      case 'serviceType':
      case 'service':
        if (target === 'contract') {
          return 'Contract';
        } else if (target === 'invoice') {
          return 'Invoice';
        }
        return 'ServiceType';
      case 'submissionDate':
      case 'dateStart':
      case 'dateEnd':
      case 'noOfPositions':
      case 'issueDate':
      case 'duePaymentDate':
      case 'currency':
        if (target === 'contract') {
          return 'Contract';
        } else if (target === 'invoice') {
          return 'Invoice';
        }
        return 'JobOrder';
      case 'createdBy':
        if (target === 'case') {
          return 'UserProfile';
        }
      default:
        return target.length > 0 ? target[0].toUpperCase() + target.slice(1) : '';
    }
  };

  public static getColumnNameFromFilterKey = (filterKey: string, target: string = '') => {
    // TODO This isn't completed
    switch (filterKey) {
      case 'serviceType':
        if (target === 'jobOrder') {
          return 'name';
        }
        return 'serviceType';
      case 'category':
        return 'name';
      case 'location':
        return 'locationName';
      case 'submissionDate':
        return 'submissionDate';
      case 'status':
      case 'type':
      case 'function':
      case 'department':
      case 'userType':
      case 'permission':
      case 'role':
        return 'name';
      case 'createdBy':
        if (target === 'case') {
          return 'name';
        }
        return 'userId';
      default:
        return filterKey.replace(/[^a-z]/gi, '');
    }
  };
  /**
   * This function has a side effect - if some filter needs to be applied,
   * query must be modified (andWhere must be added for each field in the findIn object).
   * @param {Array} findIn Array of the filters that need to be applied
   * e.q.
   * findIn [
   *  { key: 'name', value: [ 'Johannes Beam' ] },
   *  { key: 'permission',  value: [ 'assignments', 'contracts', 'eSignature' ] }
   * ]
   * @param {Array} findBetween Array of the date filters that need to search between two dates
   * but for now as we have only one date filter on each page, we can just use findBetween[0]
   * e.q.
   * findBetween [
   *  { key: 'name', from: '2020-11-11', to: '2020-11-11' }
   * ]
   * @param {any} query The query created using createQueryBuilder
   * @param {string} target Which table
   *
   */
  public static applyFilter(findIn, findBetween, query: any, target: string = '') {
    (findIn || []).forEach((item) => {
      const {key, value} = item;
      const tableName = UtilsHelper.getTableNameFromFilterKey(key, target);
      const columnName = UtilsHelper.getColumnNameFromFilterKey(key, target);
      if ((key === 'name' || key === 'createdBy') && target !== 'contract' && target !== 'invoice') {
        // if key is equal to "name" or "createdBy", check if firstName + ' ' + lastName from the table is
        // contained in the array of selected values for filtering
        query = query.andWhere(`"${tableName}"."firstName" || ' ' || "${tableName}"."lastName" = ANY (:value)`, {
          value,
        });
      } else if ((key === 'attachments' || key === 'creditNotes') && target === 'invoice') {
        query = query.andWhere(`"${tableName}"."${key}" IS NOT NULL`);
      } else if (key === 'overdue' && target === 'invoice') {
        query = query.andWhere(`"${tableName}"."duePaymentDate" > now()`);
      } else {
        // tempFieldName is created for avoiding the bug - if there are multiple parameters with the same name
        // query won't be generated properly
        const tempFieldName = tableName + columnName;
        const obj = {};
        if (key === 'userType') {
          obj[tempFieldName] = value.map((v) => (v.toLowerCase() === 'user' ? 'staff' : v.toLowerCase()));
        } else {
          obj[tempFieldName] = value;
        }
        query = query.andWhere(`"${tableName}"."${columnName}" = ANY (:${tempFieldName})`, obj);
      }
    });
    if (findBetween && findBetween.length > 0 && findBetween[0].key !== '') {
      const {key, from, to} = findBetween[0];
      const tableName = UtilsHelper.getTableNameFromFilterKey(key, target);
      const columnName = UtilsHelper.getColumnNameFromFilterKey(key, target);
      if (from && from !== '' && to && to !== '') {
        query = query.andWhere(`"${tableName}"."${columnName}" BETWEEN :from AND :to`, {from, to});
      } else if (from && from !== '') {
        query = query.andWhere(`"${tableName}"."${columnName}" >= :from`, {from});
      } else if (to && to !== '') {
        query = query.andWhere(`"${tableName}"."${columnName}" <= :to`, {to});
      }
    }
    return query;
  }

  public static getRandomBoolean() {
    return UtilsHelper.randomNumber() < 0.5;
  }

  public static getOrderDirection(sortingOptions: PlainObject) {
    return (sortingOptions?.sort?.value as 'ASC' | 'DESC') || 'ASC';
  }

  public sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  /**
   * Get the host name of the website according to the env variables
   *
   * @param {AppConfigService} appConfig - The Config service which contains the env variables info
   * @returns {string} - The plain host url leading to the root
   */
  public static getHostName(appConfig: AppConfigService): string {
    const hostName = appConfig.hostNameUrls.reduce((previousValue, item) => {
      return previousValue + (item.hostName === 'CLIENT_ACCESS' ? item.url : '');
    }, '');

    return hostName.replace('/client/login', '');
  }

  /**
   * Truncate the provided ID at a specific length
   *
   * @param {string} uuid - The input full UUID which we want to substring
   * @param {number} length - The length of the result ID
   * @returns {string} - The substring of the provided ID according to the desired length
   */
  public static formatReferenceNumber = (uuid: string, length = 8): string => {
    return uuid.length > length ? uuid.substring(uuid.length - length) : uuid;
  };

  public parseCoords(geocodeData: GeocodeResponse, parser: string): PlainObject {
    switch (parser) {
      case 'coords':
        return {
          lat: geocodeData.data?.results[0]?.geometry?.location?.lat ?? null,
          lng: geocodeData.data?.results[0]?.geometry?.location?.lng ?? null,
        };
      default:
        return null;
    }
  }

  public static async retry<T>(f: () => Promise<T>, count: number, time: number) {
    let retval = await f();
    for (let i = 0; !retval && i < count; i++) {
      await new Promise((_) => setTimeout(_, time));
      retval = await f();
    }
    return retval;
  }
}
