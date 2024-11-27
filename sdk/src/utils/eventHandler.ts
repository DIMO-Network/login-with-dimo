import { EntryState } from "../enums/globalEnums";
import { storeJWTInCookies } from "../storage/storageManager";
import { BasePayload } from "../types/BasePayload";
import { TransactionData } from "../types/TransactionData";

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
  basePayload: BasePayload, // Accept dynamic payload,
  data: any,
  expectedOrigin: string,
  popup: Window | null
) => {
  const {
    entryState,
    onSuccess,
    onError,
    setAuthenticated,
    clientId,
    redirectUri,
    apiKey,
  } = basePayload;

  const popupListener = (event: MessageEvent) => {
    if (getDomain(event.origin) !== getDomain(expectedOrigin)) {
      console.warn("Received message from an unknown origin:", event.origin);
      return;
    }

    const { eventType, token, authType, transactionHash, message } = event.data;

    if (eventType === "READY") {
      // Send only the relevant data based on the payload
      const initialMessage = {
        clientId,
        redirectUri,
        apiKey,
        entryState,
        eventType: "AUTH_INIT",
      };

      setTimeout(() => {
        if (popup) {
          popup.postMessage(initialMessage, expectedOrigin);
        } else {
          onError(new Error("Popup window not available to send credentials"));
        }
      }, 0);

    }

    if (eventType === data.eventType) {
      //SEND DATA MESSAGE, WITH PAYLOAD AND EVENT TYPE
      const dataMessage = { ...data, eventType: data.eventType };

      setTimeout(() => {
        if (popup) {
          popup.postMessage(dataMessage, expectedOrigin);
        } else {
          onError(new Error("Popup window not available to send credentials"));
        }
      }, 0);      
    }

    if (authType === "popup" && token) {
      storeJWTInCookies(token);
      setAuthenticated(true);
      onSuccess({ token });

      if (popup && !popup.closed) {
        popup.close();
      }

      window.removeEventListener("message", popupListener);
    }

    if (eventType === "transactionResponse") {
      if (transactionHash) {
        onSuccess({ token: "", transactionHash });
      }
    }

    if (eventType === "DIMO_ERROR") {
      onError(new Error(message));
    }
  };

  window.addEventListener("message", popupListener);

  return () => window.removeEventListener("message", popupListener);
};

export const handleMessageForEmbed = (basePayload: BasePayload, data: any) => {
  const embedListener = (event: MessageEvent) => {
    const {
      entryState,
      onSuccess,
      onError,
      setAuthenticated,
      clientId,
      redirectUri,
      apiKey,
      dimoLogin,
    } = basePayload;

    if (getDomain(event.origin) !== getDomain(dimoLogin)) {
      console.warn("Received message from an unknown origin:", event.origin);
      return;
    }

    const { eventType, token, authType, transactionHash, transactionReceipt } =
      event.data;

    if (eventType === "READY") {
      // Once the "READY" message is received, send the credentials
      console.log("Ready Message received");
      const iframe = document.getElementById("dimo-iframe");

      // Define the message data
      const initialMessage = {
        clientId,
        redirectUri,
        apiKey,
        entryState,
        eventType: "AUTH_INIT",
      };

      // Send the message to the iframe
      //@ts-ignore
      iframe.contentWindow.postMessage(initialMessage, dimoLogin);
    }

    if (eventType === data.eventType) {
      //SEND DATA MESSAGE, WITH PAYLOAD AND EVENT TYPE
      const dataMessage = { ...data, eventType: data.eventType };

      //@ts-ignore
      iframe.contentWindow.postMessage(dataMessage, dimoLogin);      
    }    

    if (authType === "embed" && token) {
      storeJWTInCookies(token);
      setAuthenticated(true);
      onSuccess({ token });
    }

    if (eventType === "transactionResponse") {
      if (transactionHash || transactionReceipt) {
        onSuccess({ token: "", transactionHash, transactionReceipt });
      } else {
        onError(Error("Could not execute transaction"));
      }
    }
  };

  // Add event listener specifically for embed auth
  window.addEventListener("message", embedListener);

  // Return a cleanup function to remove this listener
  return () => window.removeEventListener("message", embedListener);
};
