import { handleMessageForPopup } from "../utils/eventHandler";

export const popupAuth = (
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  dimoLogin: string,
  clientId: string,
  redirectUri: string,
  apiKey?: string,
  permissionTemplateId?: string,
  vehicles?: string[]
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
      onSuccess,
      onError,
      popup,
      clientId,
      redirectUri,
      apiKey,
      permissionTemplateId,
      vehicles
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      onError(error);
    } else {
      onError(new Error("An unknown error occurred"));
    }
  }
};
