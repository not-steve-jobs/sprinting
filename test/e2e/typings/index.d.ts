export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(object: Object): R;
    }
  }
}
