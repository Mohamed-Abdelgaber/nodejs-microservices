export class Command<PayloadType extends object = {}> {
  constructor(public readonly service: string, public readonly payload: PayloadType) {}
}
