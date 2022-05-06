import { Product } from '@core/product/product.aggregate-root';
import { ProductRepository } from '@core/product/product.repository';
import { CommandHandler } from '@krater/building-blocks';
import { CreateNewProductCommand } from './create-new-product.command';

interface Dependencies {
  productRepository: ProductRepository;
}

interface CreateNewProductCommandResult {
  id: string;
  name: string;
  description: string;
  type: string;
  weight: number;
  price: number;
}

export class CreateNewProductCommandHandler
  implements CommandHandler<CreateNewProductCommand, CreateNewProductCommandResult>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { ...payload },
  }: CreateNewProductCommand): Promise<CreateNewProductCommandResult> {
    const { productRepository } = this.dependencies;

    const product = Product.createNew(payload);

    await productRepository.insert(product);

    return product.toJSON();
  }
}
