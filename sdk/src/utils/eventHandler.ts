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

export const handleMessageForPopup = (
  expectedOrigin: string,
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  windowToClose?: Window | null
) => {
  const popupListener = (event: MessageEvent) => {
    if (event.origin !== expectedOrigin) {
      console.warn("Received message from an unknown origin:", event.origin);
      return;
    }

    const { token, authType } = event.data;

    if (authType === 'popup' && token) {
      onSuccess({ token });
      
      // Close the popup after success
      if (windowToClose && !windowToClose.closed) {
        windowToClose.close();
        console.log("Popup closed successfully.");
      }

      window.removeEventListener("message", popupListener);
    } else {
      onError(new Error("No valid token received in the popup auth message."));
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
    if (event.origin !== expectedOrigin) {
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
