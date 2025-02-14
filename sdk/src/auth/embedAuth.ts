import { BasePayload } from "../types/BasePayload";
import { handleMessageForEmbed } from "../utils/eventHandler";

export const embedAuth = (
  basePayload: BasePayload,
  data?: Record<string, any>
) => {
  const cleanup = handleMessageForEmbed(basePayload, data);
};
