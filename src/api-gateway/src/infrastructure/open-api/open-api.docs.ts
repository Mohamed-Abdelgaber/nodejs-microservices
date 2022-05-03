import openApiJSDoc from 'swagger-jsdoc';
import path from 'path';

export const openApiDocs = openApiJSDoc({
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Krater API',
      version: '0.0.1',
      description: 'This is API for Krater.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-auth-token',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, '..', '..', 'api', '**', '*.action.ts'),
    path.join(__dirname, '..', '..', 'api', 'schemas', '**', '*.schema.ts'),
  ],
});
