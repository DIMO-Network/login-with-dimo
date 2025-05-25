import { MessageEventType, LoginMode } from '@enums/index';
import {
  AuthData,
  AuthPayload,
  DimoActionPayload,
  EventHandlers,
  MessageData,
  MessageHandlerConfig,
} from '@dimo-types/index';
import { logout, processAuthResponse } from './authUtils';

const getDomain = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (e) {
    console.warn('Invalid URL:', url);
    return '';
  }
};

const validateOrigin = (origin: string, expectedDomain: string): boolean => {
  const isValid = getDomain(origin) === getDomain(expectedDomain);
  if (!isValid) {
    console.warn('Received message from an unknown origin:', origin);
  }
  return isValid;
};

const sendMessageToTarget = (
  target: Window | null | undefined,
  message: object,
  origin: string,
  onError: (error: Error) => void
): void => {
  if (!target) {
    onError(new Error('Target window not available to send credentials'));
    return;
  }

  setTimeout(() => target.postMessage(message, origin), 0);
};

const handleCommonEvents = (
  eventType: string,
  data: MessageData,
  handlers: EventHandlers,
  extraData: Record<string, unknown> = {}
): boolean => {
  const {
    token,
    walletAddress,
    email,
    sharedVehicles,
    message,
    transactionHash,
    transactionReceipt,
    mode,
  } = data;

  if (
    mode &&
    ![LoginMode.Popup, LoginMode.Embed, LoginMode.Redirect].includes(mode)
  ) {
    handlers.onError(new Error('Invalid mode provided'));
    return false;
  }

  switch (eventType) {
    case MessageEventType.AUTH_RESPONSE:
      processAuthResponse(
        { token, walletAddress, email, sharedVehicles, ...extraData },
        handlers.setAuthenticated,
        handlers.onSuccess
      );
      return true;

    case MessageEventType.TRANSACTION_RESPONSE:
      if (!token) {
        handlers.onError(new Error('Missing authentication token'));
        return false;
      }

      if (transactionHash || transactionReceipt) {
        const responseData: AuthData = {
          token: token,
          ...(transactionHash && { transactionHash }),
          ...(transactionReceipt && { transactionReceipt }),
        };
        handlers.onSuccess(responseData);
      } else {
        handlers.onError(new Error('Could not execute transaction'));
      }
      return true;

    case MessageEventType.LOGOUT:
      logout(handlers.setAuthenticated);
      return true;

    case MessageEventType.DIMO_ERROR:
      handlers.onError(new Error(message || 'An unknown error occurred'));
      return true;
  }

  return false;
};

export const createMessageHandler = (
  basePayload: AuthPayload,
  data: DimoActionPayload | undefined,
  config: MessageHandlerConfig
) => {
  const {
    onSuccess,
    onError,
    setAuthenticated,
    clientId,
    redirectUri,
    apiKey,
    entryState,
    forceEmail,
    altTitle,
  } = basePayload;

  const { target, origin, mode } = config;

  const messageListener = (event: MessageEvent) => {
    if (!validateOrigin(event.origin, origin)) return;

    const messageData: MessageData = event.data;
    if (messageData.mode !== mode) return;

    const { eventType } = messageData;

    if (eventType === MessageEventType.READY) {
      const initialMessage = {
        clientId,
        redirectUri,
        apiKey,
        entryState,
        forceEmail,
        eventType: MessageEventType.AUTH_INIT,
        ...(mode === LoginMode.Popup && { altTitle }),
      };
      sendMessageToTarget(target, initialMessage, origin, onError);
    }

    if (eventType === data?.eventType) {
      sendMessageToTarget(
        target,
        { ...data, eventType: data.eventType },
        origin,
        onError
      );
    }

    handleCommonEvents(
      eventType,
      messageData,
      { onSuccess, onError, setAuthenticated },
      mode === LoginMode.Popup
        ? { sharedVehicles: messageData.sharedVehicles }
        : {}
    );
  };

  window.addEventListener('message', messageListener);
  return () => window.removeEventListener('message', messageListener);
};

export const handleMessageForPopup = (
  basePayload: AuthPayload,
  data: DimoActionPayload | undefined,
  expectedOrigin: string,
  popup: Window | null
) => {
  return createMessageHandler(basePayload, data, {
    target: popup,
    origin: expectedOrigin,
    mode: LoginMode.Popup,
  });
};

export const handleMessageForEmbed = (basePayload: AuthPayload, data: any) => {
  const iframe = document.getElementById('dimo-iframe') as HTMLIFrameElement;
  return createMessageHandler(basePayload, data, {
    target: iframe?.contentWindow,
    origin: basePayload.dimoLogin,
    mode: LoginMode.Embed,
  });
};
