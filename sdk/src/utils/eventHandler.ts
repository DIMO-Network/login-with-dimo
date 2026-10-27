import { MessageEventType, DimoSDKModes } from '@enums/index';
import {
  AuthData,
  AuthPayload,
  DimoActionPayload,
  EmailRequest,
  EventHandler,
  EventHandlers,
  MessageData,
  MessageHandlerConfig,
} from '@dimo-types/index';
import { logout, processAuthResponse } from './authUtils';

const originOf = (url: string): string => {
  try {
    return new URL(url).origin;
  } catch (e) {
    console.warn('Invalid URL:', url);
    return '';
  }
};

// Scheme, host and port: an http page or another port on the same host isn't the login.
const validateOrigin = (origin: string, expectedUrl: string): boolean => {
  const isValid = origin === originOf(expectedUrl);
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
    handlers.onSuccess,
    extraData.emailRequest as EmailRequest | undefined
  );
};

const handleTransactionResponse = (
  { token, transactionHash, transactionReceipt, accountGranted }: MessageData,
  handlers: EventHandlers
): void => {
  if (!token) {
    handlers.onError(new Error('Missing authentication token'));
    return;
  }

  if (transactionHash || transactionReceipt || accountGranted) {
    const responseData: AuthData = {
      token: token,
      ...(transactionHash && { transactionHash }),
      ...(transactionReceipt && { transactionReceipt }),
      ...(accountGranted !== undefined && { accountGranted }),
    };
    handlers.onSuccess(responseData);
  } else {
    handlers.onError(new Error('Could not execute transaction'));
  }
};

const handleMessageResponse = (
  { token, signature, signer }: MessageData,
  handlers: EventHandlers
): void => {
  if (!token) {
    handlers.onError(new Error('Missing authentication token'));
    return;
  }

  if (signature) {
    handlers.onSuccess({
      token,
      signature,
      ...(signer && { signer }),
    });
  } else {
    handlers.onError(new Error('Could not produce signature'));
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

const handleProvisionResponse = (
  { clientId, tokenId, privateKey }: MessageData,
  handlers: EventHandlers,
): void => {
  if (!clientId || tokenId == null) {
    handlers.onError(new Error('Incomplete provision response'));
    return;
  }
  handlers.onSuccess({ clientId, tokenId, privateKey } as unknown as AuthData);
};

const eventHandlers: Record<string, EventHandler> = {
  [MessageEventType.AUTH_RESPONSE]: handleAuthResponse,
  [MessageEventType.TRANSACTION_RESPONSE]: handleTransactionResponse,
  [MessageEventType.MESSAGE_RESPONSE]: handleMessageResponse,
  [MessageEventType.PROVISION_RESPONSE]: handleProvisionResponse,
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
    emailRequest,
    altTitle,
    brandName,
    tosUrl,
    privacyPolicyUrl,
    language,
  } = basePayload;

  const { target, origin, mode } = config;

  // Each click opens its own popup and listener; a listener answers only its
  // popup and stops at that popup's answer, so an earlier click's callbacks
  // never receive a later popup's token, signature or key.
  const stop = () => {
    window.removeEventListener('message', messageListener);
    clearInterval(closedPoll);
  };

  const messageListener = (event: MessageEvent) => {
    if (!validateOrigin(event.origin, origin)) return;
    if (target && event.source !== target) return;

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
        emailRequest,
        brandName,
        tosUrl,
        privacyPolicyUrl,
        language,
        altTitle,
        eventType: MessageEventType.AUTH_INIT,
      };
      sendMessageToTarget(target, initialMessage, origin, onError);
      return;
    }

    // The login asks for the button's action payload by its event type.
    if (data && eventType === data.eventType) {
      sendMessageToTarget(target, data, origin, onError);
      return;
    }

    if (!(eventType in eventHandlers)) return;
    stop();
    handleCommonEvents(
      eventType,
      messageData,
      { onSuccess, onError, setAuthenticated },
      { emailRequest }
    );
  };

  // A popup closed without answering leaves nothing to listen for.
  const closedPoll = setInterval(() => {
    if (target?.closed) stop();
  }, 1000);

  window.addEventListener('message', messageListener);
  return stop;
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
