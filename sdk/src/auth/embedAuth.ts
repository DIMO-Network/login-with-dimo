import { EntryState } from '../enums/globalEnums';
import { BasePayload } from '../types/BasePayload';
import { TransactionData } from '../types/TransactionData';
import { handleMessageForEmbed } from '../utils/eventHandler';

export const embedAuth = (
  basePayload: BasePayload,
  data?: Record<string, any>
) => {
  const cleanup = handleMessageForEmbed(basePayload, data);
};
