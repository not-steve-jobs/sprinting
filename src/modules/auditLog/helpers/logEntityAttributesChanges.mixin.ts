import {isDate, isEqual} from 'date-fns';
import {difference} from 'lodash';
import {AuditLogChanges} from 'src/modules/auditLog/auditLog.interface';

/**
 * Provide the ability to log the changes of the attributes of a specific entity
 * Note: This mixin should be used alongside with LogAttributeChanges for every attribute which we want to watch
 */
export class LogEntityAttributesChanges {
  // Note: Unfortunately we can't use the original properties if we want to override teh default getter/setter methods
  // Note: We keep the entity properties inside a separate pool because otherwise we will flood the default namespace of the object
  _properties = {};

  // Contains all changes of the entity attributes decorated with LogAttributeChanges
  _attributesChangeLog: AuditLogChanges = {};

  /**
   * Simply return the logged changes of all watched entity attributes
   *
   * @returns {LogAttributeChanges}
   */
  public getAttributesChangeLog() {
    return this._attributesChangeLog;
  }

  /**
   * Add new log for a specific attribute change
   * We keep only value changes and omit same values but different type changes
   * Example: '156' is the same as 156
   *
   * @param {string} property - The changed property
   * @param {T} newValue - The new value of the changed property
   */
  public addAttributeToChangeLog(property: string, newValue): void {
    const oldValue = this._properties[`_${property}`];

    if (!oldValue || this.isSamePropertyValue(oldValue, newValue)) {
      return;
    }

    this._attributesChangeLog[property] = {
      old: oldValue,
      new: newValue,
    };
  }

  /**
   * Check whether the provided values are the same no matter of their type
   * We keep only value changes and omit same values but different type changes
   * Example: '156' is the same as 156
   *
   * @param {T} oldValue
   * @param {T} newValue
   * @returns {boolean}
   */
  private isSamePropertyValue<T>(oldValue: T, newValue: T): boolean {
    if (oldValue == newValue || this.isSameDate(oldValue, newValue) || this.isSameArray(oldValue, newValue)) {
      return true;
    }

    return false;
  }

  private isSameDate(oldValue, newValue): boolean {
    if (isDate(oldValue)) {
      const oldDate = new Date(oldValue);
      const newDate = new Date(newValue);

      return isEqual(oldDate, newDate);
    }

    return false;
  }

  /**
   * Compare the values of two arrays, because if we try to use the == operator is not enough
   *
   * @param {T | T[]} oldValue
   * @param {T | T[]} newValue
   * @returns {boolean}
   */
  private isSameArray<T>(oldValue: T | T[], newValue: T | T[]): boolean {
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      const differences = difference(oldValue, newValue);

      return differences.length === 0 ? true : false;
    }

    return false;
  }
}
