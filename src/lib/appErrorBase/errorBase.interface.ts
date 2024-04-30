export interface ErrorBase<T> extends Error {
  getName: () => string;

  getStack: () => string;

  getStatus: () => number | undefined;
  setStatus: (status: number) => this;

  getData: () => T | undefined;
  setData: (data: T) => this;
  mergeData: (data: T) => this;

  getInnerError: () => Error | undefined;
  setInnerError: (error: Error) => this;

  raise: () => never;
}
