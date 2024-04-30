export class EntityBuilder<T> {
  constructor(t?: Partial<T>) {
    this.set(t);
  }

  protected data: T | {} = {};

  public set(data: Partial<T>) {
    Object.assign(this.data, data);
    return this;
  }
}
