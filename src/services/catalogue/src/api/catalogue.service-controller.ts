import {
  AddNewProductTypeCommand,
  AddNewProductTypePayload,
} from '@app/commands/add-new-product-type/add-new-product-type.command';
import { CreateNewProductCommand } from '@app/commands/create-new-product/create-new-product.command';
import { CreateNewProductPayload } from '@core/product/product.aggregate-root';
import { CommandBus, ServiceClient, ServiceController } from '@krater/building-blocks';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  serviceClient: ServiceClient;
  commandBus: CommandBus;
  tracer: Tracer;
}

export class CatalogueServiceController implements ServiceController {
  constructor(private readonly dependencies: Dependencies) {}

  public async setup(): Promise<void> {
    await Promise.all([this.handleCreateNewProduct(), this.handleAddNewProductType()]);
  }

  private async handleCreateNewProduct() {
    const { commandBus, serviceClient, tracer } = this.dependencies;

    await serviceClient.subscribe<CreateNewProductPayload>(
      'catalogue.create_new_product',
      (data, { spanContext }) => {
        const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

        return commandBus.handle(new CreateNewProductCommand(data), {
          context,
        });
      },
    );
  }

  private async handleAddNewProductType() {
    const { commandBus, serviceClient, tracer } = this.dependencies;

    await serviceClient.subscribe<AddNewProductTypePayload>(
      'catalogue.add_new_product',
      (data, { spanContext }) => {
        const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

        return commandBus.handle(new AddNewProductTypeCommand(data), {
          context,
        });
      },
    );
  }
}
