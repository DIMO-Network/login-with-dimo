import { EntryState } from "../enums/globalEnums";
import { handleMessageForEmbed } from "../utils/eventHandler";

export const embedAuth = (
  entryState: EntryState,
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  dimoLogin: string,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string,
  permissionTemplateId?: string,
  vehicles?: string[],
  vehicleMakes?: string[]
) => {
  const cleanup = handleMessageForEmbed(
    dimoLogin,
    entryState,
    onSuccess,
    onError,
    setAuthenticated,
    clientId,
    redirectUri,
    apiKey,
    permissionTemplateId,
    vehicles,
    vehicleMakes
  );
};
