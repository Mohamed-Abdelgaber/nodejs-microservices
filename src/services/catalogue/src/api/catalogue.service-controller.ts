import {
  AddNewProductTypeCommand,
  AddNewProductTypePayload,
} from '@app/commands/add-new-product-type/add-new-product-type.command';
import { CreateNewProductCommand } from '@app/commands/create-new-product/create-new-product.command';
import { GetProductsQuery } from '@app/queries/get-products/get-products.query';
import { CreateNewProductPayload } from '@core/product/product.aggregate-root';
import {
  CommandBus,
  PaginatedQuery,
  QueryBus,
  ServiceClient,
  ServiceController,
} from '@krater/building-blocks';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  serviceClient: ServiceClient;
  commandBus: CommandBus;
  tracer: Tracer;
  queryBus: QueryBus;
}

export class CatalogueServiceController implements ServiceController {
  constructor(private readonly dependencies: Dependencies) {}

  public async setup(): Promise<void> {
    await Promise.all([
      this.handleCreateNewProduct(),
      this.handleAddNewProductType(),
      this.handleGetProducts(),
    ]);
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

  private async handleGetProducts() {
    const { queryBus, serviceClient, tracer } = this.dependencies;

    await serviceClient.subscribe<PaginatedQuery>(
      'catalogue.get_products',
      (data, { spanContext }) => {
        const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

        return queryBus.handle(new GetProductsQuery(data), {
          context,
        });
      },
    );
  }
}
