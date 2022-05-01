import { KraterError } from '@errors/krater.error';
import * as redis from 'redis';
import { ServiceClient } from './service-client';

export class RedisServiceClient implements ServiceClient {
  private publisher: redis.RedisClientType;
  private subscriber: redis.RedisClientType;

  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
  }

  public async bootstrap(): Promise<void> {
    await Promise.all([this.publisher.connect(), this.subscriber.connect()]);
  }

  public async send<PayloadType extends object = {}>(
    topic: string,
    payload: PayloadType,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const replyTopic = this.getReplyTopic(topic);

      await this.publisher.publish(topic, JSON.stringify(payload));

      await this.subscriber.subscribe(replyTopic, async (message) => {
        const result = JSON.parse(message);

        if ('error' in result) {
          const { error } = result;

          await this.subscriber.unsubscribe(replyTopic);

          reject(new KraterError(error.message, error.name, error.errorCode));
        }
        resolve(result);
      });
    });
  }

  public async subscribe<PayloadType extends object = {}>(
    topic: string,
    callback: (data: PayloadType) => any | Promise<any>,
  ): Promise<void> {
    await this.subscriber.subscribe(topic, async (message) => {
      try {
        const result = await callback(JSON.parse(message));

        await this.publisher.publish(this.getReplyTopic(topic), JSON.stringify(result ?? {}));
      } catch (error) {
        await this.publisher.publish(this.getReplyTopic(topic), JSON.stringify({ error }));
      }
    });
  }

  private getReplyTopic(topic: string) {
    return `${topic}.reply`;
  }
}
