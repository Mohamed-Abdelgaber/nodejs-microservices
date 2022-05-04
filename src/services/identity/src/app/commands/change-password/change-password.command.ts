import { Command } from '@krater/building-blocks';
import { SpanContext } from 'opentracing';

export interface ChangePasswordCommandPayload {
  accountId: string;
  oldPassword: string;
  newPassword: string;
  context: SpanContext;
}

export class ChangePasswordCommand implements Command<ChangePasswordCommandPayload> {
  constructor(public readonly payload: ChangePasswordCommandPayload) {}
}
