import { AuthPayload } from '@dimo-types/index';
import { handleMessageForEmbed } from '@utils/eventHandler';

export const embedAuth = (
  basePayload: AuthPayload,
  data?: Record<string, any>
) => {
  const cleanup = handleMessageForEmbed(basePayload, data);
};
