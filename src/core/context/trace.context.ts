export enum AppPlatform {
  ios,
  android,
  none,
}

export class TraceContext {
  public headers?: {[key: string]: string};
  public payload?: any;
  public method?: any;
  public path?: any;
  public fullUrl?: string;
  public route?: any;
  public platform: AppPlatform = AppPlatform.none;
  private readonly headerFilter = [
    'accept',
    'host',
    'accept-encoding',
    'user-agent',
    'content-type',
    'content-length',
    'connection',
    'cache-control',
    'postman-token',
    'x-forwarded-for',
    'x-forwarded-proto',
    'x-forwarded-port',
    'x-amzn-trace-id',
  ];

  constructor(public requestTraceId: string, public clientTraceId: string) {}

  public setHeaders(headers: any): void {
    this.headers = {};
    Object.keys(headers)
      .filter((header) => !this.headerFilter.includes(header))
      .forEach((header) => {
        this.headers[header] = headers[header];
      });

    // Handling special iOS headers not fully aligned
    if (this.headers['x-device-os']?.toLowerCase()?.trim()?.startsWith('ios')) {
      this.headers['x-device-platform'] = 'ios';
      this.headers['x-device-os-version'] = this.headers['x-device-os'].substring(4);
      // delete this.headers['x-device-os'];
    }

    if (this.headers['x-device-platform']?.toLowerCase()?.trim() === 'ios') {
      this.platform = AppPlatform.ios;
    } else if (this.headers['x-device-platform']?.toLowerCase()?.trim() === 'android') {
      this.platform = AppPlatform.android;
    }

    switch (this.platform) {
      case AppPlatform.ios:
        this.headers['x-app-version-ext'] = 'iOS ';
        break;
      case AppPlatform.android:
        this.headers['x-app-version-ext'] = 'Android ';
        break;
      default:
        this.headers['x-app-version-ext'] = 'Other ';
    }
    const appVersion = this.headers['x-appversion'] || this.headers['x-app-version'];
    if (appVersion) {
      this.headers['x-app-version-ext'] += appVersion;
    } else {
      this.headers['x-app-version-ext'] += 'Unknown';
    }
  }
}
