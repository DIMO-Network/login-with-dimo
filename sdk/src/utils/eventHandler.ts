import { MessageEventType } from "../enums/globalEnums";
import { BasePayload } from "../types/BasePayload";
import { logout, processAuthResponse } from "./authUtils";

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

const validateOrigin = (origin: string, expectedDomain: string): boolean => {
  if (getDomain(origin) !== getDomain(expectedDomain)) {
    console.warn("Received message from an unknown origin:", origin);
    return false;
  }
  return true;
};

const sendMessageToTarget = (
  target: Window | null | undefined,
  message: object,
  origin: string,
  onError: (error: Error) => void,
) => {
  if (target) {
    setTimeout(() => {
      target.postMessage(message, origin);
    }, 0);
  } else {
    onError(new Error("Target window not available to send credentials"));
  }
};

// Popup Handler
export const handleMessageForPopup = (
  basePayload: BasePayload,
  data: any,
  expectedOrigin: string,
  popup: Window | null,
) => {
  const {
    entryState,
    onSuccess,
    onError,
    setAuthenticated,
    clientId,
    redirectUri,
    apiKey,
    forceEmail,
  } = basePayload;

  const popupListener = (event: MessageEvent) => {
    if (!validateOrigin(event.origin, expectedOrigin)) return;

    const {
      eventType,
      token,
      walletAddress,
      email,
      mode,
      transactionHash,
      sharedVehicles,
      message,
    } = event.data;

    if (mode === "popup") {
      if (eventType === MessageEventType.READY) {
        const initialMessage = {
          clientId,
          redirectUri,
          apiKey,
          entryState,
          forceEmail,
          eventType: MessageEventType.AUTH_INIT,
        };
        sendMessageToTarget(popup, initialMessage, expectedOrigin, onError);
      }

      if (eventType === data.eventType) {
        const dataMessage = { ...data, eventType: data.eventType };
        sendMessageToTarget(popup, dataMessage, expectedOrigin, onError);
      }

      if (eventType === "authResponse") {
        processAuthResponse(
          { token, walletAddress, email, sharedVehicles },
          setAuthenticated,
          onSuccess,
        );
      }

      if (
        eventType === MessageEventType.TRANSACTION_RESPONSE &&
        transactionHash
      ) {
        onSuccess({ token, transactionHash });
      }

      if (eventType === MessageEventType.LOGOUT) {
        logout(setAuthenticated);
      }

      if (eventType === "DIMO_ERROR") {
        onError(new Error(message));
      }
    }
  };

  window.addEventListener("message", popupListener);
  return () => window.removeEventListener("message", popupListener);
};

// Embed Handler
export const handleMessageForEmbed = (basePayload: BasePayload, data: any) => {
  const {
    entryState,
    onSuccess,
    onError,
    setAuthenticated,
    clientId,
    redirectUri,
    apiKey,
    dimoLogin,
    forceEmail,
  } = basePayload;

  const embedListener = (event: MessageEvent) => {
    if (!validateOrigin(event.origin, dimoLogin)) return;

    const iframe = document.getElementById("dimo-iframe");

    const {
      eventType,
      token,
      walletAddress,
      email,
      mode,
      transactionHash,
      transactionReceipt,
      message,
    } = event.data;

    if (mode === "embed") {
      if (eventType === MessageEventType.READY) {
        const initialMessage = {
          clientId,
          redirectUri,
          apiKey,
          entryState,
          forceEmail,
          eventType: MessageEventType.AUTH_INIT,
        };
        //@ts-ignore
        sendMessageToTarget(
          iframe?.contentWindow,
          initialMessage,
          dimoLogin,
          onError,
        );
      }

      if (eventType === data.eventType) {
        const dataMessage = { ...data, eventType: data.eventType };
        //@ts-ignore
        sendMessageToTarget(
          iframe?.contentWindow,
          dataMessage,
          dimoLogin,
          onError,
        );
      }

      processAuthResponse(
        { token, walletAddress, email },
        setAuthenticated,
        onSuccess,
      );

      if (eventType === MessageEventType.TRANSACTION_RESPONSE) {
        if (transactionHash || transactionReceipt) {
          onSuccess({ token, transactionHash, transactionReceipt });
        } else {
          onError(new Error("Could not execute transaction"));
        }
      }

      if (eventType === MessageEventType.LOGOUT) {
        logout(setAuthenticated);
      }

      if (eventType === "DIMO_ERROR") {
        onError(new Error(message));
      }
    }
  };

  window.addEventListener("message", embedListener);
  return () => window.removeEventListener("message", embedListener);
};
