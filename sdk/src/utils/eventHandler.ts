import { MessageEventType, DimoSDKModes } from '@enums/index';
import {
  AuthData,
  AuthPayload,
  DimoActionPayload,
  EventHandler,
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
    console.error('Received message from an unknown origin:', origin);
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

  try {
    target.postMessage(message, origin);
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};

const handleCommonEvents = (
  eventType: string,
  data: MessageData,
  handlers: EventHandlers,
  extraData: Record<string, unknown> = {}
): void => {
  const handler = eventHandlers[eventType as keyof typeof eventHandlers];
  if (!handler) {
    console.warn('No handler found for event type:', eventType);
    return;
  }

  handler(data, handlers, extraData);
};

const handleAuthResponse = (
  data: MessageData,
  handlers: EventHandlers,
  extraData: Record<string, unknown>
): void => {
  processAuthResponse(
    { ...data, ...extraData },
    handlers.setAuthenticated,
    handlers.onSuccess
  );
};

const handleTransactionResponse = (
  { token, transactionHash, transactionReceipt }: MessageData,
  handlers: EventHandlers
): void => {
  if (!token) {
    handlers.onError(new Error('Missing authentication token'));
    return;
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
};

const handleLogout = (_: MessageData, handlers: EventHandlers): void => {
  logout(handlers.setAuthenticated);
};

const handleDimoError = (
  { message }: MessageData,
  handlers: EventHandlers
): void => {
  handlers.onError(new Error(message || 'An unknown error occurred'));
};

const eventHandlers: Record<string, EventHandler> = {
  [MessageEventType.AUTH_RESPONSE]: handleAuthResponse,
  [MessageEventType.TRANSACTION_RESPONSE]: handleTransactionResponse,
  [MessageEventType.LOGOUT]: handleLogout,
  [MessageEventType.DIMO_ERROR]: handleDimoError,
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
        ...(mode === DimoSDKModes.POPUP && { altTitle }),
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
      mode === DimoSDKModes.POPUP
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
    mode: DimoSDKModes.POPUP,
  });
};

