import { Command } from '@krater/building-blocks';

export interface PublishProductCommandPayload {
  productId: string;
}

export class PublishProductCommand implements Command<PublishProductCommandPayload> {
  constructor(public readonly payload: PublishProductCommandPayload) {}
}
