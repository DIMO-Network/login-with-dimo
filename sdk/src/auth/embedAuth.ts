import { handleMessageForEmbed } from "../utils/eventHandler";

export const embedAuth = (
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string
) => {
  // Embed logic TBD
  const authServerUrl = "https://ab1a735dff55.ngrok.app/"; //TODO: Pull from ENV

  const cleanup = handleMessageForEmbed(
    authServerUrl,
    onSuccess,
    onError,
    clientId,
    redirectUri,
    apiKey
  );
};
