import { handleMessageForEmbed } from "../utils/eventHandler";

export const embedAuth = (
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  dimoLogin: string,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string,
  permissionTemplateId?: string,
  vehicles?: string[]
) => {
  const cleanup = handleMessageForEmbed(
    dimoLogin,
    onSuccess,
    onError,
    setAuthenticated,
    clientId,
    redirectUri,
    apiKey,
    permissionTemplateId,
    vehicles
  );
};
