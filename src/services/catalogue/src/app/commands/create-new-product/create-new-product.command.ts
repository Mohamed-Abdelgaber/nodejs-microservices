import { CreateNewProductPayload } from '@core/product/product.aggregate-root';
import { Command } from '@krater/building-blocks';

export class CreateNewProductCommand implements Command<CreateNewProductPayload> {
  constructor(public readonly payload: CreateNewProductPayload) {}
}
