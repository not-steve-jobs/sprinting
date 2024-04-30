import * as util from 'util';

function createWarning(message: string, name: string, data?: object): void {
  const dataKey = `${name[0].toLowerCase()}${name.substring(1)}Data`;
  this[dataKey] = data;
  this.name = name;
  this.message = message;
}

export class AppWarningBase {
  public static initWarnings(this: any): void {
    // For each property
    Object.keys(this).forEach((key) => {
      // Replace property with constructor function
      this[key] = function (data?: object): void {
        createWarning.call(this, key, key, data);
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
