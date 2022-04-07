export class FraudCheckHistory {
  constructor(
    private id: string,
    private customerId: string,
    private fraudster: boolean,
    private createdAt: Date,
  ) {}

  public getId() {
    return this.id;
  }

  public getCustomerId() {
    return this.customerId;
  }

  public isFraudster() {
    return this.fraudster;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      fraudster: this.fraudster,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
