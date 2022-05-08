import { Query } from '@krater/building-blocks';

export interface GetSingleProductQueryPayload {
  productId: string;
}

export class GetSingleProductQuery implements Query<GetSingleProductQueryPayload> {
  constructor(public readonly payload: GetSingleProductQueryPayload) {}
}
