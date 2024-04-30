import {RedisExpirationTime} from './redis.enum';
import {createClient, RedisClient, Callback} from 'redis';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {promisify} from 'util';
import {Injectable} from '@nestjs/common';
import {Logger} from 'src/core/logger';
import {SharedErrors} from 'src/core/error/shared.error';
import os from 'os';

interface ExpandedRedisClient extends RedisClient {
  setAsync?(key: string, value: string, type: string, expire: number): Promise<boolean>;
  getAsync?(key: string): Promise<string>;
  keysAsync?(pattern: string): Promise<string[]>;
  delAsync?(key: string): Promise<void>;
}

@Injectable()
export class RedisService {
  private client: ExpandedRedisClient;

  constructor(private readonly appConfig: AppConfigService, private readonly logger: Logger) {
    if (!this.getPassword() || !this.getHost()) {
      return;
    }
    this.client = createClient({
      host: this.getHost(),
      tls: this.getHost(),
      password: this.getPassword(),
      port: this.getPort(),
    });
    this.client.getAsync = promisify(this.client.get).bind(this.client);
    this.client.setAsync = promisify(this.client.set).bind(this.client);
    this.client.keysAsync = promisify(this.client.keys).bind(this.client);
    this.client.delAsync = promisify(this.client.del).bind(this.client);

    this.client.on('uncaughtException', (error) => {
      this.logger.error(__filename, 'Redis - uncaughtException', error);
    });

    this.client.on('error', (error) => {
      this.logger.error(__filename, 'Redis - error', error);
      if (error.code === 'ECONNREFUSED') {
        this.logger.info(__filename, 'ECONNREFUSED', error);
      }
    });
  }

  /**
   * Helper function which will fetch 'host' variable from ENV
   *
   * @return {*} {string | null}
   */
  private getHost(): string | null {
    return this.appConfig?.redis?.host ?? null;
  }

  /**
   * Helper function which will fetch 'password' variable from ENV
   *
   * @return {*} {string}
   */
  private getPassword(): string {
    return this.appConfig?.redis?.password ?? '';
  }

  /**
   * Helper function which will fetch 'port' variable from ENV
   *
   * @return {*} {number}
   */
  private getPort(): number {
    return this.appConfig?.redis?.port ?? 6380;
  }

  /**
   * Helper function which will check if all required variables are present inside ENV
   */
  private checkEnvVariables() {
    if (!this.getHost()) {
      this.logger.error(__filename, 'Missing redis env variable - REDIS_HOST');
      throw new SharedErrors.MissingEnvVariable({envVariable: 'REDIS_HOST'});
    }
    if (!this.getPassword()) {
      this.logger.error(__filename, 'Missing redis env variable - REDIS_KEY');
      throw new SharedErrors.MissingEnvVariable({envVariable: 'REDIS_KEY'});
    }
  }

  /**
   * Helper function which will add hostname as prefix for some key
   *
   * @param {string} key - key which need to be parsed
   * @return {*}  {string}
   */
  private parseKey(key: string): string {
    return `${os.hostname()}_${key}`;
  }

  /**
   * Save values for some specific key
   *
   * @param {string} key - substring of key or entire key
   * @param {string} value - value that should be saved
   * @param {number} [expireTime] - time after which data will be invalidated (in seconds)
   * @param {boolean} [parseKey=true] - in case when caller provides entire/exact key this should be false
   * @return {*}  {Promise<boolean>}
   */
  setAsync(key: string, value: string, expireTime?: number, parseKey: boolean = true): Promise<boolean> {
    try {
      this.checkEnvVariables();
    } catch (error) {
      return Promise.resolve(false);
    }
    const parsedKey = parseKey ? this.parseKey(key) : key;
    return this.client.setAsync(parsedKey, value, 'EX', expireTime ?? RedisExpirationTime.OneDay);
  }

  /**
   * Get value for some specific key
   *
   * @param {string} key - substring of key or entire key
   * @param {boolean} [parseKey=true] - in case when caller provides entire/exact key this should be false
   * @return {*}  {Promise<string | null>} The value found in the store as string, or `null` if the key was not found or there was an error.
   */
  async getAsync(key: string, parseKey: boolean = true): Promise<string | null> {
    try {
      this.checkEnvVariables();
    } catch (error) {
      return null;
    }
    const parsedKey = parseKey ? this.parseKey(key) : key;

    return this.client.getAsync(parsedKey);
  }

  /**
   * Get value for some specific key and parses the result as T
   *
   * @type {T} Expected type of the result
   * @param {string} key - substring of key or entire key
   * @param {boolean} [parseKey=true] - in case when caller provides entire/exact key this should be false
   * @return {*} {Promise<T | null>} The value found in the store parsed as an object, or `null` if the key was not found or there was an error.
   */
  async getAsyncAs<T>(key: string, parseKey: boolean = true): Promise<T | null> {
    const result = await this.getAsync(key, parseKey);
    try {
      return JSON.parse(result) as T;
    } catch (error) {
      this.logger.error(__filename, "Can't parse json from redis", {error, dataForParse: result});
      return null;
    }
  }

  /**
   * Get all keys that contains pattern as substring
   *
   * @param {string} pattern - substring of key or entire key
   * @return {*}  {Promise<string[]>}
   */
  keysAsync(pattern: string): Promise<string[]> {
    try {
      this.checkEnvVariables();
    } catch (error) {
      return Promise.resolve([]);
    }
    return this.client.keysAsync(pattern);
  }

  private async getMultiImpl<T>(
    keyPattern: string = '',
    parseKey: boolean = true,
    getFn: (key: string, parseKey: boolean) => Promise<T>,
  ) {
    try {
      this.checkEnvVariables();
    } catch (error) {
      return [];
    }
    const parsedKey = parseKey ? this.parseKey(keyPattern) : keyPattern;
    try {
      const allKeys = await this.keysAsync('*');
      const filteredKeys = allKeys.filter((key) => key.indexOf(parsedKey) !== -1);

      const promises: Promise<T>[] = [];
      filteredKeys.forEach((key) => promises.push(getFn(key, false)));

      return await Promise.all(promises);
    } catch (error) {
      this.logger.error(__filename, "Can't fetch data from redis", {error, keyPattern});
      return [];
    }
  }
  /**
   * Get values of all keys which contain 'keyPattern' as substring
   *
   * @param {string} [keyPattern=''] - sub string of key or entire key
   * @param {boolean} [parseKey=true] - in case when caller provides entire/exact key this should be false
   * @return {*} {Promise<string[]>} Array of results found in the Redis store, as strings
   */
  async getMulti(keyPattern: string = '', parseKey: boolean = true) {
    return this.getMultiImpl<string>(keyPattern, parseKey, (key, parseKey) => this.getAsync(key, parseKey));
  }

  /**
   * Get values of all keys which contain 'keyPattern' as substring and parses them to an object of type T
   *
   * @param {string} [keyPattern=''] - sub string of key or entire key
   * @param {boolean} [parseKey=true] - in case when caller provides entire/exact key this should be false
   * @return {*} {Promise<T[]>} Array of results found in the Redis store, parsed as objects
   */
  async getMultiAs<T>(keyPattern: string = '', parseKey: boolean = true): Promise<T[]> {
    return this.getMultiImpl<T>(keyPattern, parseKey, (key, parseKey) => this.getAsyncAs<T>(key, parseKey));
  }

  /**
   * Invalidates a cache key without waiting for it to expire.
   *
   * @param key Key to invalidate
   * @param parseKey Should be true if the key was also set using parseKey=true
   */
  async delAsync(key: string, parseKey: boolean = true): Promise<void> {
    try {
      this.checkEnvVariables();
    } catch (error) {
      return null;
    }
    const parsedKey = parseKey ? this.parseKey(key) : key;
    return this.client.delAsync(parsedKey);
  }

  set(key: string, value: string, cb?: Callback<'OK'>): boolean {
    try {
      this.checkEnvVariables();
    } catch (error) {
      return null;
    }
    return this.client.set(this.parseKey(key), value, cb);
  }

  get(key: string, cb?: Callback<string>) {
    try {
      this.checkEnvVariables();
    } catch (error) {
      return null;
    }
    return this.client.get(this.parseKey(key), cb);
  }
}
