export class UserContext {
  public get id(): string {
    if (!this.user) return undefined;
    return this.user.id;
  }

  public get emailAddress(): string {
    return this.user.emailAddress;
  }

  constructor(public user?: any) {}
}
