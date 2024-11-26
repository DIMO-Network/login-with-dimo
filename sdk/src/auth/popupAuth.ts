import { EntryState } from "../enums/globalEnums";
import { TransactionData } from "../types/TransactionData";
import { handleMessageForPopup } from "../utils/eventHandler";

export const popupAuth = (
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
  try {
    const popup = window.open(
      dimoLogin,
      "_blank",
      "width=500,height=600" //Allow popup to be customized by the developer
    );

    if (!popup) {
      throw new Error("Popup failed to open");
    }

    // Set up message handler for popup auth
    const cleanup = handleMessageForPopup(
      dimoLogin,
      entryState,
      onSuccess,
      onError,
      setAuthenticated,
      popup,
      clientId,
      redirectUri,
      apiKey,
      permissionTemplateId,
      vehicles,
      vehicleMakes,
      transactionData
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      onError(error);
    } else {
      onError(new Error("An unknown error occurred"));
    }
  }
};
