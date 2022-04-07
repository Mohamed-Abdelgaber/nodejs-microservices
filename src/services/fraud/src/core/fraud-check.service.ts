export interface FraudCheckService {
  isFraudulentCustomer(customerId: string): Promise<boolean>;
}
