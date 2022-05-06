import { ProductType } from '@core/product-type/product-type.entity';
import { ProductRepository } from '@core/product/product.repository';
import { CommandHandler } from '@krater/building-blocks';
import { AddNewProductTypeCommand } from './add-new-product-type.command';

interface AddNewProductTypeCommandResult {
  id: string;
  name: string;
  status: string;
}

interface Dependencies {
  productRepository: ProductRepository;
}

export class AddNewProductTypeCommandHandler
  implements CommandHandler<AddNewProductTypeCommand, AddNewProductTypeCommandResult>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { name },
  }: AddNewProductTypeCommand): Promise<AddNewProductTypeCommandResult> {
    const { productRepository } = this.dependencies;

    const productType = ProductType.createNew(name);

    await productRepository.insertProductType(productType);

    return productType.toJSON();
  }
}
