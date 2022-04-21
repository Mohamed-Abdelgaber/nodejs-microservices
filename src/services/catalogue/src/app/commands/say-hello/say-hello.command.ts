import { ServiceCommand } from '@krater/building-blocks';

interface Payload {
  message: string;
}

export class SayHelloCommand implements ServiceCommand<Payload> {
  constructor(public readonly payload: Payload) {}
}
