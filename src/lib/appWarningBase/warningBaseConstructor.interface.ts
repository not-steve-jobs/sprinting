import {WarningBase} from './warningBase.interface';

export interface WarningBaseConstructor<T> {
  new (data?: T): WarningBase<T>;
  readonly prototype: WarningBase<T>;
}
