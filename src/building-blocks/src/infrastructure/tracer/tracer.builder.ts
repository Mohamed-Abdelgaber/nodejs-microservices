import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { TracerShim } from '@opentelemetry/shim-opentracing';

export class TracerBuilder {
  private provider: NodeTracerProvider;

  constructor(serviceName: string) {
    this.provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
    });

    this.provider.addSpanProcessor(new SimpleSpanProcessor(this.getExporter()));

    this.provider.register();
  }

  public build() {
    return new TracerShim(this.provider.getTracer('opentracing-shim'));
  }

  private getExporter() {
    return new JaegerExporter();
  }
}
