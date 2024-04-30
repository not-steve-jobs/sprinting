import {Request} from 'express';
import {UtilsHelper} from '../../helpers/utils.helper';

export class ClientContext {
  public traceId: string;
  public clientVersion: string;
  public apiVersion: string;
  public platform: 'ios' | 'android' | 'other';
  public platformVersion: string;
  public platformAndClientVersion: string;
  public brand?: string;
  public name?: string;
  public appName?: string;

  constructor(request: Request, utils: UtilsHelper) {
    const h = request.headers as {[key: string]: string};
    this.traceId = h['x-client-traceid'] ?? utils.generateTrackingId('CT-X', 8);
    this.apiVersion = h['x-api-version'] ?? null;
    this.clientVersion = h['x-app-version'] ?? 'unknown';
    this.name = h['x-device-name'] ?? null;
    this.brand = h['x-device-brand'] ?? null;

    const t = h['x-device-platform'];
    this.platform = 'other';
    if (t?.toLowerCase()?.trim() === 'ios') {
      this.platform = 'ios';
    } else if (t?.toLowerCase()?.trim() === 'android') {
      this.platform = 'android';
    }
    this.platformVersion = h['x-device-os-version'] ?? 'unknown';
    this.platformAndClientVersion = `${this.platform} ${this.clientVersion}`;
  }
}
