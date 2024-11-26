import { EntryState } from "../enums/globalEnums";
import { TransactionData } from "../types/TransactionData";
import { handleMessageForEmbed } from "../utils/eventHandler";

export const embedAuth = (
  entryState: EntryState,
  onSuccess: (data: {
    token: string;
    transactionHash?: string;
    transactionReceipt?: any;
  }) => void,
  onError: (error: Error) => void,
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  dimoLogin: string,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string,
  permissionTemplateId?: string,
  vehicles?: string[],
  vehicleMakes?: string[],
  transactionData?: TransactionData
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
    vehicleMakes,
    transactionData
  );
};
