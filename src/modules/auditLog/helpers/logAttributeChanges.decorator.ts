/**
 * Log the changes of a specific entity attribute inside the changeLog property
 * Note: This decorator should be used alongside with LogEntityAttributesChanges mixin
 */
export function LogAttributeChanges<T>(): Function {
  return (target: Object, property: string) => {
    const privatePropertyKey = `_${property}`;

    /**
     * Read the value from the pool of private properties
     *
     * @returns {T}
     */
    const getter = function (): T {
      return this._properties[privatePropertyKey];
    };

    /**
     * Set the new value in the pool with the private properties
     * If we already have some old value for this property, then keep the changes
     *
     * @param {T} newValue - The new value we want to set for the property
     */
    const setter = function (newValue: T): void {
      this.addAttributeToChangeLog(property, newValue);
      this._properties[privatePropertyKey] = newValue;
    };

    // Override the default getter and setter so we can keep track of the changes
    Object.defineProperty(target, property, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
