import { handleMessageForEmbed } from "../utils/eventHandler";

export const embedAuth = (
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  dimoLogin: string,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string,
  permissionTemplateId?: string,
  vehicles?: string[]
) => {
  // Embed logic TBD

  const cleanup = handleMessageForEmbed(
    dimoLogin,
    onSuccess,
    onError,
    clientId,
    redirectUri,
    apiKey,
    permissionTemplateId,
    vehicles
  );
};
