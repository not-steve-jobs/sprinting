import {Warning} from './warning.interface';

export interface WarningBase<T> extends Warning {
  readonly data?: T;
}
