import { Command } from '@krater/building-blocks';

export interface AddNewProductTypePayload {
  name: string;
}

export class AddNewProductTypeCommand implements Command<AddNewProductTypePayload> {
  constructor(public readonly payload: AddNewProductTypePayload) {}
}
