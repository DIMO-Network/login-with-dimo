import { EntryState } from "../enums/globalEnums";
import { storeJWTInCookies } from "../storage/storageManager";

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
  entryState: EntryState,
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  popup?: Window | null,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string,
  permissionTemplateId?: string,
  vehicles?: string[],
  vehicleMakes?: string[],
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

        //Temporary Fix
        //Seems like on Safari, and Mobile Browsers - the popup is not ready to receive messages, even after sending a "READY" message
        //The set timeout acts as a solution, by modifying the callback loop
        setTimeout(() => {
          popup.postMessage(
            {
              clientId,
              redirectUri,
              apiKey,
              permissionTemplateId,
              vehicles,
              vehicleMakes,
              entryState,
              eventType: "AUTH_INIT",
            },
            expectedOrigin
          );
        }, 0);
      } else {
        onError(new Error("Popup window not available to send credentials"));
      }
    }

    if (authType === "popup" && token) {
      //TBD: Can store user object in DIMO State here, but then would need to handle clearing it out
      storeJWTInCookies(token);
      setAuthenticated(true);
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
  entryState: EntryState,
  onSuccess: (authData: { token: string }) => void,
  onError: (error: Error) => void,
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  clientId?: string,
  redirectUri?: string,
  apiKey?: string,
  permissionTemplateId?: string,
  vehicles?: string[],
  vehicleMakes?: string[],
) => {
  const embedListener = (event: MessageEvent) => {
    if (getDomain(event.origin) !== getDomain(expectedOrigin)) {
      console.warn("Received message from an unknown origin:", event.origin);
      return;
    }

    const { eventType, token, authType } = event.data;

    if (eventType === "READY") {
      // Once the "READY" message is received, send the credentials
      console.log("Ready Message received");
      const iframe = document.getElementById("dimo-iframe");

      // Define the message data
      const message = {
        clientId,
        apiKey,
        redirectUri,
        permissionTemplateId,
        vehicles,
        vehicleMakes,
        entryState,
        eventType: "AUTH_INIT",
      };

      // Send the message to the iframe
      // Replace "https://example-iframe.com" with the actual origin of the iframe's URL
      //@ts-ignore
      iframe.contentWindow.postMessage(message, expectedOrigin);
    }

    if (authType === "embed" && token) {
      storeJWTInCookies(token);
      setAuthenticated(true);
      onSuccess({ token });
    }
  };

  // Add event listener specifically for embed auth
  window.addEventListener("message", embedListener);

  // Return a cleanup function to remove this listener
  return () => window.removeEventListener("message", embedListener);
};
