import { FraudCheckService } from '@core/fraud-check.service';

export class FraudCheckServiceImpl implements FraudCheckService {
  public async isFraudulentCustomer(customerId: string): Promise<boolean> {
    return false;
  }
}
