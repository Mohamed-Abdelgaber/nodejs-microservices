import { config } from 'dotenv';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { ProductRepositoryImpl } from '@infrastructure/product/product.repository';
import { CatalogueServiceController } from '@api/catalogue.service-controller';
import { CreateNewProductCommandHandler } from '@app/commands/create-new-product/create-new-product.command-handler';
import { AddNewProductTypeCommandHandler } from '@app/commands/add-new-product-type/add-new-product-type.command-handler';
import { GetProductsQueryHandler } from '@app/queries/get-products/get-products.query-handler';

config();

(async () => {
  const service = new ServiceBuilder()
    .setName('catalogue')
    .useRabbitMQ('amqp://localhost')
    .useMongo('mongodb://localhost:27017/catalogue')
    .setCommandHandlers([
      asClass(CreateNewProductCommandHandler).singleton(),
      asClass(AddNewProductTypeCommandHandler).singleton(),
    ])
    .setQueryHandlers([asClass(GetProductsQueryHandler).singleton()])
    .setControllers([])
    .loadActions([])
    .useConsul('http://localhost:8500')
    .setEventSubscribers([])
    .setServiceControllers([asClass(CatalogueServiceController).singleton()])
    .setCustom({
      productRepository: asClass(ProductRepositoryImpl).singleton(),
    })
    .build();

  const port = Number(process.env.APP_PORT) ?? 4000;

  await service.bootstrap();

  service.listen(port);
})();
