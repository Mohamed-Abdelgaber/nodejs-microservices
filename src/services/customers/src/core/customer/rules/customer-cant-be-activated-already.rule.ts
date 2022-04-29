import { BusinessRule } from '@krater/building-blocks';

export class CustomerCantBeActivatedAlreadyRule implements BusinessRule {
  public readonly message = 'Customer is already activated.';

  constructor(private readonly activatedAt: Date | null) {}

  public isBroken(): boolean {
    return this.activatedAt !== null;
  }
}
