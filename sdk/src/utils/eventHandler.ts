/**
 * @file eventHandler.ts
 * @description Handles message passing between the parent window and a child window (popup or iframe)
 * via the `postMessage` API.
 *
 * Responsibilities:
 * - Handles messages from a popup window or of an embedded iframe, these are separated to prevent duplicate listeners
 * - Validates the message origin.
 * - Calls `onSuccess` with the token, or `onError` on failure.
 * - Optionally closes the popup window after receiving the message.
 * - Provides a cleanup function to remove the event listener.
 */
function getDomain(url: string) {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
}


export const handleMessageForPopup = (
  expectedOrigin: string,
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  popup?: Window | null,
  clientId?: string,
  apiKey?: string,
  redirectUri?: string  
) => {
  const popupListener = (event: MessageEvent) => {
    if (getDomain(event.origin) !== getDomain(expectedOrigin)) {
      console.warn("Received message from an unknown origin:", event.origin);
      return;
    }

    const { eventType, token, authType } = event.data;

    // Handle the "READY" message
    if (eventType === "READY") {
      // Once the "READY" message is received, send the credentials
      if (popup) {
        popup.postMessage(
          { clientId, apiKey, redirectUri, eventType: "AUTH_INIT" },
          expectedOrigin
        );
      } else {
        onError(new Error("Popup window not available to send credentials"));
      }
    }


    if (authType === 'popup' && token) {
      onSuccess({ token });
      
      // Close the popup after success
      if (popup && !popup.closed) {
        popup.close();
        console.log("Popup closed successfully.");
      }

      window.removeEventListener("message", popupListener);
    }
  };

  // Add event listener specifically for popup auth
  window.addEventListener("message", popupListener);

  // Return a cleanup function to remove this listener
  return () => window.removeEventListener("message", popupListener);
};

export const handleMessageForEmbed = (
  expectedOrigin: string,
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void
) => {
  const embedListener = (event: MessageEvent) => {
    if (getDomain(event.origin) !== getDomain(expectedOrigin)) {
      console.warn("Received message from an unknown origin:", event.origin);
      return;
    }

    const { token, authType } = event.data;

    if (authType === 'embed' && token) {
      onSuccess({ token });
    }
  };

  // Add event listener specifically for embed auth
  window.addEventListener("message", embedListener);

  // Return a cleanup function to remove this listener
  return () => window.removeEventListener("message", embedListener);
};
