import { handleMessageForPopup } from "../utils/eventHandler";

export const popupAuth = (
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string
) => {
  try {
    const authServerUrl = "https://ab1a735dff55.ngrok.app/"; //TODO: Pull from ENV

    const popup = window.open(
      authServerUrl,
      "_blank",
      "width=500,height=600" //Allow popup to be customized by the developer
    );

    if (!popup) {
      throw new Error("Popup failed to open");
    }

    // Set up message handler for popup auth
    const cleanup = handleMessageForPopup(
      authServerUrl,
      onSuccess,
      onError,
      popup,
      clientId,
      redirectUri,
      apiKey
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      onError(error);
    } else {
      onError(new Error("An unknown error occurred"));
    }
  }
};
