import {ErrorBase} from './errorBase.interface';

export interface ErrorBaseConstructor<T> {
  new (data?: T, innerError?: Error): ErrorBase<T>;

  readonly prototype: ErrorBase<T>;
  name: string;
}
