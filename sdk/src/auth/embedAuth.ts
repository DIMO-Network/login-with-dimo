import { BasePayload } from '@dimo-types/index';
import { handleMessageForEmbed } from '@utils/eventHandler';

export const embedAuth = (
  basePayload: BasePayload,
  data?: Record<string, any>
) => {
  const cleanup = handleMessageForEmbed(basePayload, data);
};
