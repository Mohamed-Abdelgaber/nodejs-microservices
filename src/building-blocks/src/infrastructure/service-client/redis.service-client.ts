import * as redis from 'redis';
import { ServiceClient } from './service-client';

export class RedisServiceClient implements ServiceClient {
  private publisher: redis.RedisClientType;
  private subscriber: redis.RedisClientType;
  private readonly subscriptionsCount = new Map<string, number>();

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
    const replyTopic = this.getReplyTopic(topic);

    const subscriptionCount = this.subscriptionsCount.get(replyTopic) || 0;

    if (subscriptionCount <= 0) {
      this.subscriptionsCount.set(replyTopic, subscriptionCount + 1);

      await this.subscriber.subscribe(replyTopic, (message) => {
        this.publisher.set(replyTopic, message || '{}');
      });
    }

    await this.publisher.publish(topic, JSON.stringify(payload));

    const value = (await this.publisher.get(replyTopic)) ?? '{}';

    return JSON.parse(value);
  }

  public async subscribe<PayloadType extends object = {}>(
    topic: string,
    callback: (data: PayloadType) => any | Promise<any>,
  ): Promise<void> {
    await this.subscriber.subscribe(topic, async (message) => {
      const result = await callback(JSON.parse(message));

      await this.publisher.publish(this.getReplyTopic(topic), JSON.stringify(result ?? {}));
    });
  }

  private getReplyTopic(topic: string) {
    return `${topic}.reply`;
  }
}
