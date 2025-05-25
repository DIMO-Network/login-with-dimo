import { AuthPayload, DimoActionPayload } from '@dimo-types/index';
import { handleMessageForEmbed } from '@utils/eventHandler';

export const embedAuth = (basePayload: AuthPayload, data?: DimoActionPayload) => {
  handleMessageForEmbed(basePayload, data);
};
