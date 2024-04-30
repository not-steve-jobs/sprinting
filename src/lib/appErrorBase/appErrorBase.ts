import util from 'util';
import deepmerge from 'deepmerge';
import {serializeError} from 'serialize-error';

function createError(this: any, name: string, data?: object, innerError?: Error): void {
  Error.captureStackTrace(this, this.constructor);
  this.message = '';
  this.name = name;
  this.status = 400;
  this.getName = function getName() {
    return this.name;
  };
  this.getStack = function getStack() {
    return this.stack;
  };
  this.data = data;
  this.getData = function getData() {
    return this.data;
  };
  this.setData = function setData(data: any) {
    this.data = data;
    return this;
  };
  this.mergeData = function mergeData(data: any) {
    this.data = deepmerge(this.data, data);
    return this;
  };
  this.getStatus = function getStatus() {
    return this.status;
  };
  this.setStatus = function setStatus(status: any) {
    this.status = status;
    return this;
  };
  this.innerError = innerError;
  this.getInnerError = function getInnerError() {
    return this.innerError;
  };
  this.setInnerError = function setInnerError(innerError: Error) {
    this.innerError = serializeError(innerError);
    return this;
  };
  this.raise = function raise() {
    throw this;
  };
}

export class AppErrorBase {
  public static initErrors(this: any): void {
    // For each property
    Object.keys(this).forEach((key) => {
      // Replace property with constructor function
      this[key] = function (data?: object, innerError?: Error): void {
        createError.call(this, key, data, innerError);
      };

      // Define property name on the constructor function
      Object.defineProperty(this[key], 'name', {
        writable: true,
        value: key,
      });

      // Make this property inherit from Error
      util.inherits((this as any)[key], Error);
    });
  }
}
