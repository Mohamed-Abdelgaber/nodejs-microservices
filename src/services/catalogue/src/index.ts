import { config } from 'dotenv';
import { ServiceBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';
import { ProductRepositoryImpl } from '@infrastructure/product/product.repository';
import { CatalogueServiceController } from '@api/catalogue.service-controller';
import { CreateNewProductCommandHandler } from '@app/commands/create-new-product/create-new-product.command-handler';
import { ProductTypeProviderServiceImpl } from '@infrastructure/product-type/product-type-provider.service';

config();

(async () => {
  const service = new ServiceBuilder()
    .setName('catalogue')
    .useRabbitMQ('amqp://localhost')
    .useMongo('mongodb://localhost:27017/catalogue')
    .setCommandHandlers([asClass(CreateNewProductCommandHandler).singleton()])
    .setQueryHandlers([])
    .setControllers([])
    .loadActions([])
    .useConsul('http://localhost:8500')
    .setEventSubscribers([])
    .setServiceControllers([asClass(CatalogueServiceController).singleton()])
    .setCustom({
      productRepository: asClass(ProductRepositoryImpl).singleton(),
      productTypeProviderService: asClass(ProductTypeProviderServiceImpl).singleton(),
    })
    .build();

  const port = Number(process.env.APP_PORT) ?? 4000;

  await service.bootstrap();

  service.listen(port);
})();
