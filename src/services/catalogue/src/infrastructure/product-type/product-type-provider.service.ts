import { ProductTypeProviderService } from '@core/product-type/product-type-provider.service';

export class ProductTypeProviderServiceImpl implements ProductTypeProviderService {
  public async isValueSupported(value: string): Promise<boolean> {
    return true;
  }
}
