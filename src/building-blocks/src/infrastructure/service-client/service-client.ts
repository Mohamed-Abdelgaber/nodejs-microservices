export interface ServiceClient {
  bootstrap(): Promise<void>;

  send<PayloadType extends object = {}>(topic: string, payload: PayloadType): Promise<any>;

  subscribe<PayloadType extends object = {}, Response extends object | void = void>(
    topic: string,
    callback: (data: PayloadType) => Response,
  ): Promise<void>;
}
