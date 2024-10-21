import { handleMessageForEmbed } from "../utils/eventHandler";

export const embedAuth = (
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void
) => {
  // Embed logic TBD
  const authServerUrl = "http://localhost:3000"; //TODO: Pull from ENV

  const cleanup = handleMessageForEmbed(authServerUrl, onSuccess, onError);

};
