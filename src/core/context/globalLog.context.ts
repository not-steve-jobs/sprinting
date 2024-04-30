import {AppConfigService} from '../config/appConfig.service';

export class GlobalLogContext {
  public system: string;
  public component: string;
  public env: string;
  public systemEnv: string;
  public product: {name: string};

  constructor(appConfig: AppConfigService) {
    this.system = 'clabackend';
    this.component = 'ClaBackendApi';
    this.env = appConfig.env;
    this.systemEnv = `${this.env}-${this.system}`;
    this.product = {
      name: 'ClaBackend',
    };
  }
}
