import { ProductRepository } from '@core/product/product.repository';
import { CommandHandler, NotFoundError } from '@krater/building-blocks';
import { PublishProductCommand } from './publish-product.command';

interface Dependencies {
  productRepository: ProductRepository;
}

export class PublishProductCommandHandler implements CommandHandler<PublishProductCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({ payload: { productId } }: PublishProductCommand): Promise<void> {
    const { productRepository } = this.dependencies;

    const product = await productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError(`Product with id: "${productId}" does not exist.`);
    }

    product.publish();

    await productRepository.update(product);
  }
}
