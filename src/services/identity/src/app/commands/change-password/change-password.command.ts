import { Command } from '@krater/building-blocks';

export interface ChangePasswordCommandPayload {
  accountId: string;
  oldPassword: string;
  newPassword: string;
}

export class ChangePasswordCommand implements Command<ChangePasswordCommandPayload> {
  constructor(public readonly payload: ChangePasswordCommandPayload) {}
}
